import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/apiResponse";
import { hashPassword, verifyPassword, generateTokens, verifyRefreshToken, authenticate, rateLimitConfig } from "../lib/auth";
import { AuthRequest } from "../lib/auth";
import { ErrorLogger } from "../lib/errors";
import { emailService, generateSecureToken, hashToken } from "../lib/email";
import { env } from "../lib/env";

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function registerAuthRoutes(app: FastifyInstance) {

  // Register user
  app.post("/api/auth/register", {
    config: { rateLimit: rateLimitConfig.auth }
  }, async (req, reply) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { email, username, password, firstName, lastName } = parsed.data;

      // Check if user already exists (including soft-deleted)
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ],
          deletedAt: null // Only check active users
        }
      });

      if (existingUser) {
        return reply.code(409).send(fail("User with this email or username already exists"));
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        }
      });

      const verificationToken = generateSecureToken();
      const hashedVerificationToken = hashToken(verificationToken);
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: hashedVerificationToken,
          emailVerificationExpires: verificationExpires,
        }
      });

      await emailService.sendEmailVerification(user.email, user.username, verificationToken);

      return ok({
        user,
        message: "User registered successfully. Please verify your email to activate your account."
      });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'register' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Login user
  app.post("/api/auth/login", {
    config: { rateLimit: rateLimitConfig.auth }
  }, async (req, reply) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { email, password } = parsed.data;

      // Find user (exclude soft-deleted)
      const user = await prisma.user.findFirst({
        where: { 
          email,
          deletedAt: null // Exclude soft-deleted users
        },
        select: {
          id: true,
          email: true,
          username: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          emailVerified: true,
        }
      });

      if (!user) {
        return reply.code(401).send(fail("Invalid email or password"));
      }

      if (!user.emailVerified) {
        return reply.code(403).send(fail("Email address is not verified"));
      }

      if (!user.isActive) {
        return reply.code(401).send(fail("Account is deactivated"));
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send(fail("Invalid email or password"));
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Generate token pair
      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase() as 'user' | 'admin' | 'moderator'
      });

      const { password: _, ...userWithoutPassword } = user;

      // Set refresh token in HttpOnly cookie
      reply.setCookie('refreshToken', tokens.refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return ok({
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
        // refreshToken: tokens.refreshToken, // Don't send in body
        expiresIn: tokens.expiresIn,
        message: "Login successful"
      });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'login' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Get current user
  app.get("/api/auth/me", { preHandler: authenticate }, async (req, reply) => {
    try {
      const authReq = req as AuthRequest;
      const user = await prisma.user.findFirst({
        where: { 
          id: authReq.user!.id,
          deletedAt: null, // Exclude soft-deleted
          isActive: true // Only active users
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        }
      });

      if (!user) {
        return reply.code(404).send(fail("User not found or deactivated"));
      }

      return ok({ user });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'get_user' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Change password
  app.post("/api/auth/change-password", { preHandler: authenticate }, async (req, reply) => {
    try {
      const authReq = req as AuthRequest;
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { currentPassword, newPassword } = parsed.data;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: authReq.user!.id },
        select: { password: true }
      });

      if (!user) {
        return reply.code(404).send(fail("User not found"));
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return reply.code(401).send(fail("Current password is incorrect"));
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: authReq.user!.id },
        data: { password: hashedNewPassword }
      });

      return ok({ message: "Password changed successfully" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'change_password' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Logout (client-side token removal)
  app.post("/api/auth/logout", { preHandler: authenticate }, async (req, reply) => {
    void (req as AuthRequest);
    reply.clearCookie('refreshToken', { path: '/' });
    return ok({ message: "Logout successful" });
  });

  // Refresh token
  app.post("/api/auth/refresh", async (req, reply) => {
    try {
      const refreshToken = req.cookies?.['refreshToken'];

      if (!refreshToken) {
        return reply.code(401).send(fail("Refresh token is required"));
      }

      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      if (!payload) {
        return reply.code(401).send(fail("Invalid or expired refresh token"));
      }

      // Check if user still exists and is active
      const user = await prisma.user.findFirst({
        where: { 
          id: payload.id,
          deletedAt: null, // Exclude soft-deleted
          isActive: true
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
        }
      });

      if (!user) {
        return reply.code(401).send(fail("User not found or inactive"));
      }

      if (!user.emailVerified) {
        return reply.code(401).send(fail("Email address is not verified"));
      }

      // Generate new token pair (rotate refresh token)
      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase() as 'user' | 'admin' | 'moderator'
      });

      // Set new refresh token in HttpOnly cookie
      reply.setCookie('refreshToken', tokens.refreshToken, {
        path: '/',
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return ok({
        accessToken: tokens.accessToken,
        // refreshToken: tokens.refreshToken, // Don't send in body
        expiresIn: tokens.expiresIn,
        message: "Token refreshed successfully"
      });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'refresh_token' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // ==================== EMAIL VERIFICATION ====================
  
  // Resend email verification (with strict rate limiting)
  app.post("/api/auth/resend-verification", { 
    config: { 
      rateLimit: { 
        max: 3, 
        timeWindow: '15 minutes' 
      } 
    } 
  }, async (req, reply) => {
    try {
      const schema = z.object({
        email: z.string().email("Invalid email format"),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { email } = parsed.data;

      // Find user
      const user = await prisma.user.findFirst({
        where: { email, deletedAt: null },
        select: { id: true, email: true, username: true, emailVerified: true }
      });

      // Don't reveal if email exists (security)
      if (!user) {
        return ok({ message: "If the email exists, verification link has been sent." });
      }

      if (user.emailVerified) {
        return ok({ message: "If the email exists, verification link has been sent." });
      }

      // Generate verification token (plaintext for email)
      const token = generateSecureToken();
      const hashedToken = hashToken(token);
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Save HASHED token and expiry to database for security
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: hashedToken,
          emailVerificationExpires: verificationExpires,
        }
      });

      // Send email
      await emailService.sendEmailVerification(user.email, user.username, token);

      return ok({ message: "Verification email sent successfully" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'resend_verification' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Verify email
  app.post("/api/auth/verify-email", async (req, reply) => {
    try {
      const schema = z.object({
        token: z.string().min(1, "Token is required"),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Invalid verification link"));
      }

      const { token } = parsed.data;
      const hashedToken = hashToken(token);

      // Find user with this token
      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: hashedToken,
          deletedAt: null,
        },
        select: { id: true, email: true, username: true, emailVerified: true, emailVerificationExpires: true }
      });

      if (!user) {
        return reply.code(400).send(fail("Invalid or expired verification link"));
      }

      if (user.emailVerified) {
        return reply.code(400).send(fail("Email is already verified"));
      }

      if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
        return reply.code(400).send(fail("Verification link has expired. Request a new one."));
      }

      // Mark email as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        }
      });

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.username);

      return ok({ message: "Email verified successfully" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'verify_email' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // ==================== PASSWORD RESET ====================
  
  // Request password reset (with strict rate limiting to prevent abuse)
  app.post("/api/auth/forgot-password", { 
    config: { 
      rateLimit: { 
        max: 3, 
        timeWindow: '15 minutes' 
      } 
    } 
  }, async (req, reply) => {
    try {
      const schema = z.object({
        email: z.string().email("Invalid email format"),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { email } = parsed.data;

      // Find user
      const user = await prisma.user.findFirst({
        where: { email, deletedAt: null },
        select: { id: true, email: true, username: true, isActive: true }
      });

      // Don't reveal if email exists (security best practice)
      if (!user) {
        return ok({ message: "If the email exists, password reset link has been sent." });
      }

      if (!user.isActive) {
        return ok({ message: "If the email exists, password reset link has been sent." });
      }

      // Generate reset token
      const token = generateSecureToken();
      const hashedToken = hashToken(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiresAt,
        }
      });

      // Send email
      await emailService.sendPasswordReset(user.email, user.username, token);

      return ok({ message: "Password reset link sent to your email" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'forgot_password' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, reply) => {
    try {
      const schema = z.object({
        token: z.string().min(1, "Token is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const { token, newPassword } = parsed.data;
      const hashedToken = hashToken(token);

      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: { gte: new Date() }, // Token not expired
          deletedAt: null,
        },
        select: { id: true, password: true }
      });

      if (!user) {
        return reply.code(400).send(fail("Invalid or expired reset link"));
      }

      // Check if new password is same as old (optional security measure)
      const isSamePassword = await verifyPassword(newPassword, user.password);
      if (isSamePassword) {
        return reply.code(400).send(fail("New password must be different from current password"));
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          lastPasswordChange: new Date(),
        }
      });

      return ok({ message: "Password reset successfully" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'reset_password' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });
}

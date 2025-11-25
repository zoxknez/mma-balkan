import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/apiResponse";
import { authenticate, AuthRequest } from "../lib/auth";
import { ErrorLogger } from "../lib/errors";

const updateProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters").optional(),
  firstName: z.string().max(50, "First name must be less than 50 characters").optional(),
  lastName: z.string().max(50, "Last name must be less than 50 characters").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
  path: ["username"],
});

export async function registerUserRoutes(app: FastifyInstance) {
  app.put("/api/users/profile", { preHandler: authenticate }, async (req, reply) => {
    try {
      const authReq = req as AuthRequest;
      const parsed = updateProfileSchema.safeParse(req.body ?? {});

      if (!parsed.success) {
        return reply.code(400).send(fail("Validation failed", parsed.error.issues));
      }

      const userId = authReq.user?.id;
      if (!userId) {
        return reply.code(401).send(fail("Unauthorized"));
      }

      const currentUser = await prisma.user.findFirst({
        where: {
          id: userId,
          deletedAt: null,
          isActive: true,
        },
        select: {
          id: true,
          username: true,
        },
      });

      if (!currentUser) {
        return reply.code(404).send(fail("User not found or inactive"));
      }

      const data = parsed.data;
      const updateData: { username?: string; firstName?: string | null; lastName?: string | null } = {};

      if (data.username && data.username !== currentUser.username) {
        const existingUsername = await prisma.user.findFirst({
          where: {
            username: data.username,
            deletedAt: null,
            NOT: { id: currentUser.id },
          },
          select: { id: true },
        });

        if (existingUsername) {
          return reply.code(409).send(fail("Username is already taken"));
        }

        updateData.username = data.username;
      }

      if (Object.prototype.hasOwnProperty.call(data, 'firstName')) {
        updateData.firstName = data.firstName?.trim() ? data.firstName.trim() : null;
      }

      if (Object.prototype.hasOwnProperty.call(data, 'lastName')) {
        updateData.lastName = data.lastName?.trim() ? data.lastName.trim() : null;
      }

      if (Object.keys(updateData).length === 0) {
        return reply.code(400).send(fail("No changes provided"));
      }

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData,
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
        },
      });

      return ok({ user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
      ErrorLogger.log(error as Error, { context: 'update_profile' });
      return reply.code(500).send(fail("Internal server error"));
    }
  });
}

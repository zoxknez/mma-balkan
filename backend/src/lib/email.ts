/**
 * Email Service
 * 
 * PRODUCTION SETUP:
 * 1. Install: npm install nodemailer @types/nodemailer
 * 2. Add to .env:
 *    EMAIL_HOST=smtp.gmail.com
 *    EMAIL_PORT=587
 *    EMAIL_USER=your-email@gmail.com
 *    EMAIL_PASSWORD=your-app-password
 *    EMAIL_FROM=noreply@mmabalkan.com
 * 
 * For development: Use Ethereal.email (generated below)
 */

import crypto from 'crypto';
import { env } from './env';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email templates
export const emailTemplates = {
  /**
   * Email Verification Template
   */
  emailVerification: (data: { username: string; verificationLink: string }) => ({
    subject: 'Potvrdite vašu email adresu - MMA Balkan',
    html: `
      <!DOCTYPE html>
      <html lang="sr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; color: white; }
          .content { padding: 40px; }
          .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          p { line-height: 1.6; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ MMA BALKAN</div>
          </div>
          <div class="content">
            <h2>Dobrodošli, ${data.username}!</h2>
            <p>Hvala što ste se registrovali na MMA Balkan platformu. Da biste aktivirali vaš nalog, molimo potvrdite vašu email adresu.</p>
            <p style="text-align: center;">
              <a href="${data.verificationLink}" class="button">Potvrdi email adresu</a>
            </p>
            <p style="font-size: 13px; color: #6b7280;">
              Ako dugme ne radi, kopirajte i nalepite sledeći link u browser:<br>
              <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${data.verificationLink}</code>
            </p>
            <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
              Ovaj link ističe za 24 sata. Ako niste kreirali nalog, ignorišite ovaj email.
            </p>
          </div>
          <div class="footer">
            © 2025 MMA Balkan. Sva prava zadržana.<br>
            <a href="https://mmabalkan.com" style="color: #10b981;">mmabalkan.com</a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dobrodošli, ${data.username}!

Hvala što ste se registrovali na MMA Balkan platformu. 

Da biste aktivirali vaš nalog, kliknite na sledeći link:
${data.verificationLink}

Ovaj link ističe za 24 sata.

Ako niste kreirali nalog, ignorišite ovaj email.

© 2025 MMA Balkan
https://mmabalkan.com
    `.trim(),
  }),

  /**
   * Password Reset Template
   */
  passwordReset: (data: { username: string; resetLink: string }) => ({
    subject: 'Resetujte vašu lozinku - MMA Balkan',
    html: `
      <!DOCTYPE html>
      <html lang="sr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px; text-align: center; }
          .logo { font-size: 32px; font-weight: bold; color: white; }
          .content { padding: 40px; }
          .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .alert { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          p { line-height: 1.6; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ MMA BALKAN</div>
          </div>
          <div class="content">
            <h2>Resetovanje lozinke</h2>
            <p>Pozdrav, ${data.username}!</p>
            <p>Primili smo zahtev za resetovanje vaše lozinke. Kliknite na dugme ispod da kreirate novu lozinku.</p>
            <p style="text-align: center;">
              <a href="${data.resetLink}" class="button">Resetuj lozinku</a>
            </p>
            <div class="alert">
              <strong>⚠️ Bezbednosno upozorenje:</strong><br>
              Ovaj link ističe za 1 sat. Ako niste zatražili resetovanje lozinke, ignorišite ovaj email i vaš nalog će ostati siguran.
            </div>
            <p style="font-size: 13px; color: #6b7280;">
              Ako dugme ne radi, kopirajte i nalepite sledeći link:<br>
              <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${data.resetLink}</code>
            </p>
          </div>
          <div class="footer">
            © 2025 MMA Balkan. Sva prava zadržana.
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Pozdrav, ${data.username}!

Primili smo zahtev za resetovanje vaše lozinke.

Kliknite na sledeći link da kreirate novu lozinku:
${data.resetLink}

⚠️ BEZBEDNOSNO UPOZORENJE:
Ovaj link ističe za 1 sat.
Ako niste zatražili resetovanje, ignorišite ovaj email.

© 2025 MMA Balkan
    `.trim(),
  }),

  /**
   * Welcome Email after verification
   */
  welcome: (data: { username: string }) => ({
    subject: 'Dobrodošli na MMA Balkan! 🥊',
    html: `
      <!DOCTYPE html>
      <html lang="sr">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #10b981, #3b82f6); padding: 40px; text-align: center; color: white; }
          .content { padding: 40px; }
          .feature { display: flex; align-items: start; margin: 20px 0; }
          .feature-icon { font-size: 24px; margin-right: 16px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px; margin-bottom: 8px;">🥊</div>
            <h1>Dobrodošli na MMA Balkan!</h1>
          </div>
          <div class="content">
            <p>Zdravo, <strong>${data.username}</strong>!</p>
            <p>Vaš nalog je uspešno aktiviran. Dobrodošli u zajednicu MMA entuzijasta sa Balkana!</p>
            
            <h3 style="margin-top: 30px;">Šta možete raditi:</h3>
            <div class="feature">
              <span class="feature-icon">👊</span>
              <div>
                <strong>Pratite borce</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Budite u toku sa najnovijim statistikama i borbama</span>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">📅</span>
              <div>
                <strong>Događaji</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Ne propustite nijedan MMA događaj sa Balkana</span>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">📰</span>
              <div>
                <strong>Najnovije vesti</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Budite informisani o svemu što se dešava u MMA svetu</span>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🏆</span>
              <div>
                <strong>Predviđanja</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Takmičite se sa drugim fanovima u predviđanju pobednika</span>
              </div>
            </div>
          </div>
          <div class="footer">
            © 2025 MMA Balkan. Sva prava zadržana.
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dobrodošli na MMA Balkan, ${data.username}!

Vaš nalog je uspešno aktiviran.

Šta možete raditi:
👊 Pratite borce
📅 Pregledajte događaje
📰 Čitajte najnovije vesti
🏆 Predviđajte pobednike

Hvala što ste deo naše zajednice!

© 2025 MMA Balkan
    `.trim(),
  }),
};

/**
 * Email Service Class
 */
export class EmailService {
  private static instance: EmailService;
  private transporter: unknown = null;
  private isConfigured = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async initialize() {
    // Check if email is configured
    const hasEmailConfig = Boolean(env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASSWORD);

    if (!hasEmailConfig) {
      console.warn('⚠️  Email not configured. Using console logging for development.');
      console.log('📧 To enable email:');
      console.log('   1. npm install nodemailer');
      console.log('   2. Add EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD to .env');
      return;
    }

    try {
      // Dynamic import of nodemailer (optional dependency)
      const nodemailer = await import('nodemailer');

      this.transporter = nodemailer.createTransport({
        host: env.EMAIL_HOST!,
        port: env.EMAIL_PORT,
        secure: env.EMAIL_SECURE,
        auth: {
          user: env.EMAIL_USER!,
          pass: env.EMAIL_PASSWORD!,
        },
      });

      this.isConfigured = true;
      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  /**
   * Send email (with fallback to console in development)
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      // Development fallback - log to console
      console.log('\n📧 ========== EMAIL (DEV MODE) ==========');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`\n${options.text || options.html}\n`);
      console.log('========================================\n');
      return true;
    }

    try {
      const nodemailer = await import('nodemailer');
      const transporter = this.transporter as ReturnType<typeof nodemailer.createTransport>;

      await transporter.sendMail({
        from: env.EMAIL_FROM || 'noreply@mmabalkan.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      console.log(`✅ Email sent to ${options.to}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(email: string, username: string, token: string): Promise<boolean> {
    const baseUrl = env.ORIGIN || 'http://localhost:3002';
    const verificationLink = `${baseUrl}/auth/verify-email?token=${token}`;

    const template = emailTemplates.emailVerification({ username, verificationLink });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string, username: string, token: string): Promise<boolean> {
    const baseUrl = env.ORIGIN || 'http://localhost:3002';
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    const template = emailTemplates.passwordReset({ username, resetLink });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    const template = emailTemplates.welcome({ username });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }
}

/**
 * Generate secure random token
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash token for database storage (prevents token leakage)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Export singleton
export const emailService = EmailService.getInstance();


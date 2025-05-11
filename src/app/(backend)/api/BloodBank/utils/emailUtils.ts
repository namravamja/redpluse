// src/app/(backend)/api/BloodBank/utils/emailUtils.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (not your personal password)
  },
});

const url = process.env.VERCEL_URL || "http://localhost:3000";

/**
 * Sends verification email to the user
 * @param email User's email address
 * @param token Verification token
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${url}/Verification/BloodBank?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Sends password reset email to the user
 * @param email User's email address
 * @param token Reset password token
 */
export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${url}/ResetPassword/BloodBank?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
}
import nodemailer from "nodemailer";

export async function sendResetEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or SMTP config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `http://localhost:3001/reset-password/${token}`;

  await transporter.sendMail({
    from: `"NepaLink Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  });
}

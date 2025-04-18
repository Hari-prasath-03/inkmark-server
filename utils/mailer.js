import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

export const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
  const mailOption = {
    from: process.env.MAIL_USER,
    to,
    subject: "🔐 InkMark Email Verification - OTP Inside!",
    html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 16px;">
            <h2 style="color: #4a90e2; margin: 0;">InkMark</h2>
            <p style="font-size: 14px; color: #888;">Simple & Effective Markdown Management</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <div style="padding: 20px 0;">
            <h3 style="color: #333;">Your One-Time Password (OTP)</h3>
            <p style="font-size: 16px; color: #555;">Please use the following OTP to verify your email address:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; letter-spacing: 3px; background-color: #f1f1f1; border-radius: 8px; color: #222;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #777;">This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <div style="font-size: 12px; color: #aaa; text-align: center; padding-top: 16px;">
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p>© ${new Date().getFullYear()} InkMark. All rights reserved.</p>
          </div>
        </div>
      `,
  };

  return transporter.sendMail(mailOption);
};

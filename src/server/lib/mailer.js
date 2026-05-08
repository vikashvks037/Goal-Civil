import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(to, name, otp) {
  await transporter.sendMail({
    from: `"GoalCivil BPSC" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${otp} — Your GoalCivil Verification Code`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">GoalCivil</h1>
          <p style="margin: 4px 0 0; color: #bfdbfe; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">BPSC Coaching Institute</p>
        </div>
        <div style="padding: 32px;">
          <p style="margin: 0 0 8px; color: #374151; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px; line-height: 1.6;">
            Use the verification code below to complete your registration. This code expires in <strong>10 minutes</strong>.
          </p>
          <div style="background: #f0f9ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
            <p style="margin: 0; color: #1d4ed8; font-size: 40px; font-weight: 900; letter-spacing: 12px;">${otp}</p>
          </div>
          <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #f3f4f6; text-align: center;">
          <p style="margin: 0; color: #d1d5db; font-size: 11px;">© ${new Date().getFullYear()} GoalCivil. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetOTP(to, name, otp) {
  await transporter.sendMail({
    from: `"GoalCivil BPSC" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${otp} — Password Reset Code`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px 32px 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">GoalCivil</h1>
          <p style="margin: 4px 0 0; color: #fef3c7; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Password Reset</p>
        </div>
        <div style="padding: 32px;">
          <p style="margin: 0 0 8px; color: #374151; font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px; line-height: 1.6;">
            You requested a password reset. Use this code to set a new password. Expires in <strong>10 minutes</strong>.
          </p>
          <div style="background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <p style="margin: 0 0 4px; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Reset Code</p>
            <p style="margin: 0; color: #d97706; font-size: 40px; font-weight: 900; letter-spacing: 12px;">${otp}</p>
          </div>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">If you didn't request a password reset, ignore this email.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; border-top: 1px solid #f3f4f6; text-align: center;">
          <p style="margin: 0; color: #d1d5db; font-size: 11px;">© ${new Date().getFullYear()} GoalCivil. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(`[OTP Email] EMAIL_USER or EMAIL_PASS not configured. Demo OTP for ${toEmail}: ${otp}`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Aptitude Pro" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Aptitude Pro — Password Reset Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: #000000; color: #ffffff; font-size: 20px; font-weight: bold; border-radius: 12px; margin-bottom: 12px;">A</div>
            <h2 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700;">Password Reset Code</h2>
            <p style="margin: 6px 0 0; color: #6b7280; font-size: 13px;">Use the code below to securely reset your password</p>
          </div>
          
          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1428A0;">${otp}</span>
            <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">This OTP code expires in <strong>10 minutes</strong>.</p>
          </div>
          
          <p style="color: #4b5563; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">If you did not request a password reset, you can safely ignore this email. Your account remains protected.</p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 11px; margin: 0;">&copy; 2026 Aptitude Pro. All rights reserved.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[OTP Email] Successfully sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error('[OTP Email Error]', error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };

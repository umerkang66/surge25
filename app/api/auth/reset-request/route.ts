import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    // Reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${email}`;

    // Configure Nodemailer for Sendinblue SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Sendinblue SMTP host
      port: 587,
      secure: false, // Use TLS (not SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send reset email
    await transporter.sendMail({
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your CampusConnect Password',
      html: `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden;">
        
        <div style="background: linear-gradient(90deg, #2563eb, #1e40af); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">CampusConnect</h1>
        </div>

        <div style="padding: 32px;">
          <h2 style="color: #111827; font-size: 20px;">Password Reset Request</h2>
          <p style="color: #374151; font-size: 16px; margin-top: 10px;">
            We received a request to reset your CampusConnect account password.
          </p>
          <p style="color: #374151; font-size: 16px;">
            Click the button below to securely reset your password. This link will expire in <strong>15 minutes</strong>.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" 
              style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
              🔁 Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            If you didn’t request this, you can safely ignore this email. Your password will remain unchanged.
          </p>

          <p style="color: #111827; font-size: 16px; margin-top: 24px;">Best regards,</p>
          <p style="color: #2563eb; font-weight: 600;">The CampusConnect Team</p>
        </div>

        <div style="background-color: #f3f4f6; text-align: center; padding: 16px; font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} CampusConnect. All rights reserved.
        </div>

      </div>
    </div>
  `,
    });

    return NextResponse.json({ message: 'Reset email sent successfully' });
  } catch (error) {
    console.error('Reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

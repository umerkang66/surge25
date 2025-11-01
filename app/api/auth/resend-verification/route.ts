import connectDB from '@/lib/mongodb';
import User from '@/models/user';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  if (user.emailVerified)
    return new Response(JSON.stringify({ error: 'Already verified' }), {
      status: 400,
    });

  // Generate new token
  const verifyToken = crypto.randomBytes(32).toString('hex');
  const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  user.verifyToken = verifyToken;
  user.verifyTokenExpiry = verifyTokenExpiry;
  await user.save();

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${verifyToken}`;

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your CampusConnect Email',
    html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`,
  });

  return new Response(JSON.stringify({ message: 'Verification email sent' }), {
    status: 200,
  });
}

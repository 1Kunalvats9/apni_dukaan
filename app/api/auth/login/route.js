import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDb from '@/lib/ connectDb';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connectDb();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        // Check the origin of the request to determine if it's from the web
        const origin = headers().get('origin');
        const isWebAppRequest = origin && origin !== `exp://127.0.0.1:${process.env.EXPO_DEV_CLIENT_PORT}`;

        if (isWebAppRequest) {
            const appRedirectUrl = `apnidukaanapp://auth/callback?token=${token}&userId=${user._id}`;
            return NextResponse.redirect(appRedirectUrl, { status: 302 });
        } else {
            return NextResponse.json({ message: 'Login successful', token });
        }

      } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}
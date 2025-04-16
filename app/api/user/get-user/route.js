// pages/api/user/get-user.js (or .ts)
import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user && email.length>0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import bcrypt from 'bcrypt';
import connectDb from '@/lib/ connectDb';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const {
          shopName,
          ownerName,
          email,
          password,
          location,
          category,
          phoneNumber,
        } = await req.json(); 
        await connectDb();

        if (!shopName || !ownerName || !email || !password || !location || !category || !phoneNumber) {
          return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          shopName,
          ownerName,
          email,
          password: hashedPassword,
          location,
          category,
          phoneNumber,
        });

        await newUser.save();

        // Avoid sending back the full user object, especially the password hash
        const userResponse = {
            _id: newUser._id,
            shopName: newUser.shopName,
            ownerName: newUser.ownerName,
            email: newUser.email,
            location: newUser.location,
            category: newUser.category,
            phoneNumber: newUser.phoneNumber,
            createdAt: newUser.createdAt 
        };

        return NextResponse.json({ message: 'User registered successfully', user: userResponse }, { status: 201 });

      } catch (error) {
        console.error('Register Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
}
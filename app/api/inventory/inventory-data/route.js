import { NextResponse } from 'next/server';
import Inventory from '@/models/Inventory';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const inventory = await Inventory.findOne({ email });
    const products = inventory ? inventory.products : [];
    return NextResponse.json({ success: true, data: inventory, products }, { status: 200 });
  } catch (err) {
    console.error('❌ Error fetching inventory:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
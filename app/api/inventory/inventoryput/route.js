import { NextResponse } from 'next/server';
// Assuming Inventory model is in a separate file
import Inventory from '@/models/Inventory';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { email, name, category, quantity, retailPrice, wholesalePrice, url } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, message: 'Required fields missing' }, { status: 400 });
    }

    let inventory = await Inventory.findOne({ email });

    if (!inventory) {
      inventory = new Inventory({ email, products: [] });
    }

    inventory.products.push({ name, category, quantity, retailPrice, wholesalePrice, url });

    await inventory.save();

    return NextResponse.json({ success: true, message: 'Product added successfully' }, { status: 201 });
  } catch (err) {
    console.error('❌ Error adding product:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

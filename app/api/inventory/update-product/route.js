import { NextResponse } from 'next/server';
// Assuming Inventory model is in a separate file
import Inventory from '@/models/Inventory';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { _id, name, quantity, retailPrice } = await req.json();

    const updated = await Inventory.updateOne(
      { 'products._id': _id },
      {
        $set: {
          'products.$.name': name,
          'products.$.quantity': quantity,
          'products.$.retailPrice': retailPrice,
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'Product not found or already updated' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Inventory from '@/models/Inventory';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { id } = await req.json();

    const deleted = await Inventory.updateOne(
      { 'products._id': id },
      { $pull: { products: { _id: id } } }
    );

    if (deleted.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

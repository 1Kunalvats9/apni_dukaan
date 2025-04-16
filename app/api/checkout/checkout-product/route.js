import { NextResponse } from 'next/server';

import User from '@/models/user';
import Inventory from '@/models/Inventory';
import connectDb from '@/lib/ connectDb';

export async function POST(req) {
  try {
    await connectDb();
    const { cart, email } = await req.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0 || !email) {
      return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    let totalPrice = 0;
    let totalProfit = 0;
    const orderedProducts = [];

    for (const cartItem of cart) {
      const { name, price, wholesalePrice, quantity: qty, id } = cartItem;
      const itemTotalPrice = price * qty;
      totalPrice += itemTotalPrice;
      totalProfit += (price - wholesalePrice) * qty;

      const inventory = await Inventory.findOne({ email });
      if (!inventory) {
        return NextResponse.json({ message: `Inventory not found for email: ${email}` }, { status: 404 });
      }

      const productInInventory = inventory.products.find(p => p.id === id);
      if (!productInInventory) {
        return NextResponse.json({ message: `Product with ID ${id} not found in inventory` }, { status: 404 });
      }

      if (productInInventory.quantity < qty) {
        return NextResponse.json({ message: `Insufficient quantity for product: ${name}` }, { status: 400 });
      }

      productInInventory.quantity -= qty;
      await inventory.save();

      orderedProducts.push({ productId: id, name, quantity: qty, price });
    }

    const newCheckout = { orderedProducts, totalPrice };
    user.totalIncome += totalPrice;
    user.profit += totalProfit;
    user.checkoutHistory.push(newCheckout);
    await user.save();

    return NextResponse.json({ message: 'Checkout successful. Inventory updated, user income and profit updated.' }, { status: 200 });
  } catch (error) {
    console.error('Error during checkout:', error);
    return NextResponse.json({ message: 'An error occurred during checkout.', error: error.message }, { status: 500 });
  }
}

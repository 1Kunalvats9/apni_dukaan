import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true }, 
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true }
});
const CartItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }, 
  totalPrice: { type: Number, required: true }, 
}, { _id: false }); 

const InventorySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  products: [ProductSchema], 
  cart: [CartItemSchema], 
  createdAt: { type: Date, default: Date.now },
});




const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema, "inventory");

export default Inventory;
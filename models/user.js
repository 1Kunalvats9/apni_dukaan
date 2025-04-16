import mongoose from 'mongoose';

const checkoutItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: Number,
  price: Number, 
});

const checkoutSchema = new mongoose.Schema({
  orderedProducts: [checkoutItemSchema],
  totalPrice: { type: Number, required: true },
  dateOfCheckout: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    checkoutHistory: [checkoutSchema],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
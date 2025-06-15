const { default: mongoose } = require("mongoose");


const CartItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }, 
    totalPrice: { type: Number, required: true }, 
    }, 
    { _id: false }
); 



const checkoutSchema = new mongoose.Schema({
    phoneNumber:Number,
    history:[CartItemSchema]
})


const CheckoutHistory = mongoose.models.CheckoutHistory || mongoose.model("CheckoutHistory", checkoutSchema, "checkoutHistory");

export default CheckoutHistory;
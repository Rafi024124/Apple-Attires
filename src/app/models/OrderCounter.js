import mongoose from "mongoose";

const orderCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const OrderCounter =
  mongoose.models.OrderCounter || mongoose.model("OrderCounter", orderCounterSchema);

export default OrderCounter;

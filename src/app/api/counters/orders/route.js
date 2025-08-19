import { connectToDB } from "@/lib/mongodb"; // your existing DB connection
import OrderCounter from "@/models/OrderCounter"; // Mongoose model

export async function PATCH(req) {
  try {
    await connectToDB();

    // increment total orders
    const counter = await OrderCounter.findByIdAndUpdate(
      "totalOrders",
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ count: counter.count }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const counter = await OrderCounter.findById("totalOrders");
    return new Response(JSON.stringify({ count: counter?.count || 0 }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

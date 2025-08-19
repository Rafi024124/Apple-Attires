import { connectToDB } from "@/lib/mongodb";
import SalesCounter from "@/models/SalesCounter";

export async function PATCH(req) {
  try {
    await connectToDB();
    const { amount } = await req.json();

    if (!amount) throw new Error("Amount is required");

    const counter = await SalesCounter.findByIdAndUpdate(
      "totalSales",
      { $inc: { amount } },
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ amount: counter.amount }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const counter = await SalesCounter.findById("totalSales");
    return new Response(JSON.stringify({ amount: counter?.amount || 0 }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

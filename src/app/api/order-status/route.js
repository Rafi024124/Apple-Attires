// file: /app/api/order-status/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const ordersCollection = await dbConnect(collectionNamesObj.ordersCollection || "orders");

    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
  console.log(order);
  
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.consignmentId) {
      return NextResponse.json({ error: "This order has not been consigned yet" }, { status: 400 });
    }

    // Call Packzy API to get status
    const response = await axios.get(
  `https://portal.packzy.com/api/v1/status_by_cid/${order.consignmentId}`,
  {
    headers: {
      "Content-Type": "application/json",
      "API-KEY": process.env.STEADFAST_API_KEY,
      "SECRET-KEY": process.env.STEADFAST_API_SECRET,
    },
  }
);

    console.log("Packzy API response:", response.data);


    return NextResponse.json(response.data, { status: response.status });

  } catch (err) {
    console.error("Packzy Status API Error:", err.response?.data || err.message);
    return NextResponse.json(
      err.response?.data || { error: err.message },
      { status: err.response?.status || 500 }
    );
  }
}

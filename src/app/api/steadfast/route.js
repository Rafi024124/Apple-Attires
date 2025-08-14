// file: /app/api/create-consignment/route.js (Next.js App Router)

import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Receive order data from frontend
    const body = await req.json();
   

     const ordersCollection = await dbConnect(collectionNamesObj.ordersCollection || "orders");

    // 1️⃣ Check if order is already consigned
    const existingOrder = await ordersCollection.findOne({ _id: new ObjectId(body._id) });
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (existingOrder.consignmentId) {
      return NextResponse.json(
        { error: "This order has already been consigned", consignmentId: existingOrder.consignmentId },
        { status: 400 }
      );
    }
    // Construct payload exactly as Packzy expects
    const orderData = {
      invoice: `INV-${body._id}`, // unique invoice
      recipient_name: body.name,
      recipient_phone: body.phone,
      recipient_address: body.address,
      cod_amount: body.totalPrice,
      note: `Order placed on ${new Date(body.orderDate).toLocaleString()}`,
      delivery_area: body.insideDhaka ? "Inside Dhaka" : "Outside Dhaka",
      delivery_charge: body.deliveryCharge,
      number_of_items: body.cartItems?.length || 1,
    };

    // Send request server-side
    const response = await axios.post(
      "https://portal.packzy.com/api/v1/create_order",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          "API-KEY": process.env.STEADFAST_API_KEY,
          "SECRET-KEY": process.env.STEADFAST_API_SECRET,
        },
        timeout: 10000, // optional, 10s timeout
      }
    );
    console.log("Consignment API response:", response.data);

   const consignmentId = response.data?.consignment?.consignment_id || null;

    
// Save to your MongoDB order
 // 2️⃣ Connect to orders collection
    

    // 3️⃣ Update order with consignmentId
    await ordersCollection.updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { consignmentId } }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    console.error("Packzy API Error:", err.response?.data || err.message);

    return NextResponse.json(
      err.response?.data || { error: err.message },
      { status: err.response?.status || 500 }
    );
  }
}

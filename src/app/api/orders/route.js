
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {

  

  try {

    const orderData = await req.json();

    // --- VALIDATION ---
    if (!orderData.name || typeof orderData.name !== "string" || orderData.name.trim() === "") {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    if (!orderData.phone || typeof orderData.phone !== "string" || orderData.phone.trim() === "") {
      return new Response(JSON.stringify({ error: "Phone number is required" }), { status: 400 });
    }

    if (!orderData.address || typeof orderData.address !== "string" || orderData.address.trim() === "") {
      return new Response(JSON.stringify({ error: "Address is required" }), { status: 400 });
    }

    if (!orderData.cartItems || !Array.isArray(orderData.cartItems) || orderData.cartItems.length === 0) {
      return new Response(JSON.stringify({ error: "Cart items are required" }), { status: 400 });
    }

    if (orderData.deliveryCharge === undefined || typeof orderData.deliveryCharge !== "number") {
      return new Response(JSON.stringify({ error: "Delivery charge must be provided" }), { status: 400 });
    }

    if (orderData.totalPrice === undefined || typeof orderData.totalPrice !== "number" || orderData.totalPrice < 0) {
      return new Response(JSON.stringify({ error: "Invalid total price" }), { status: 400 });
    }
  console.log("from server",orderData.cartItems);
  
    // --- CONNECT TO COLLECTIONS ---
    const ordersCollection = await dbConnect(collectionNamesObj.ordersCollection || "orders");
    const productsCollection = await dbConnect(collectionNamesObj.coversCollection || "products");
    const summariesCollection = await dbConnect("orderSummaries");

    // --- CHECK STOCK & DECREMENT ---
    for (const item of orderData.cartItems) {
      const productId = item._id;
      
      console.log(productId);
      
      const quantity = item.quantity || 1;

      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
      console.log(product);
      
      if (!product) {
        return new Response(JSON.stringify({ error: `Product not found: ${item.name}` }), { status: 400 });
      }
      
      const currentStock = Number(product.stock || 0);
      if (currentStock < quantity) {
        return new Response(
          JSON.stringify({ error: `Not enough stock for ${item.name}. Available: ${currentStock}` }),
          { status: 400 }
        );
      }

      // Decrement stock
      await productsCollection.updateOne(
  { _id: new ObjectId(productId) },
  { $set: { stock: currentStock - quantity } }
);
    }

    // --- INSERT ORDER ---
    const result = await ordersCollection.insertOne({
      ...orderData,
      createdAt: new Date(),
    });

    // --- UPDATE ORDER SUMMARY ---
    await summariesCollection.updateOne(
      { phone: orderData.phone },
      { $inc: { totalOrders: 1 }, $set: { lastOrderDate: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: result.insertedId.toString(),
    });

  } catch (error) {
    console.error("Error in orders POST:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}



export async function GET(req) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const ordersCollection = await dbConnect(collectionNamesObj.ordersCollection || "orders");

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: "i" } },
        { _id: ObjectId.isValid(search) ? new ObjectId(search) : null }
      ].filter(item => item._id || item.phone);
    }
    if (status !== "All") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // Lookup to join orderSummaries collection by phone to get totalOrders count
      {
        $lookup: {
          from: "orderSummaries",
          localField: "phone",
          foreignField: "phone",
          as: "summary",
        }
      },

      // Add orderCount field from the joined summary document (or 0 if not found)
      {
        $addFields: {
          orderCount: {
            $cond: [
              { $gt: [{ $size: "$summary" }, 0] },
              { $arrayElemAt: ["$summary.totalOrders", 0] },
              0
            ]
          }
        }
      },

      // Remove the summary array from the results
      {
        $project: { summary: 0 }
      }
    ];

    const orders = await ordersCollection.aggregate(pipeline).toArray();
    const totalOrders = await ordersCollection.countDocuments(filter);

    return NextResponse.json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
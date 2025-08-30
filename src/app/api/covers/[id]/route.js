import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req, { params }) => {
  
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Find the main cover
    const cover = await coversCollection.findOne({ _id: new ObjectId(id) });
    if (!cover) return NextResponse.json({ error: "Cover not found" }, { status: 404 });

    // Increment views
    await coversCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    
    

    // Fetch related products (same subCategory & mainCat, exclude current)
    let related = [];
    if (cover.subCategory && cover.mainCategory) {
      related = await coversCollection
  .find({
    subCategory: { $regex: `^${cover.subCategory}$`, $options: "i" },
    mainCategory: { $regex: `^${cover.mainCategory}$`, $options: "i" },
    _id: { $ne: new ObjectId(id) },
  })
  .limit(8)
  .toArray();
    }
    console.log(related);
    

    // Return main cover + related products
    return NextResponse.json({ ...cover, related });
  } catch (error) {
    console.error("GET /covers/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  try {
    const { id } = params;
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    const result = await coversCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
     return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  try {
    const { id } = params;
    const body = await req.json();
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Update product by id with the request body (partial or full)
    const result = await coversCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated" }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
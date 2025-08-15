import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (req, {params}) =>{
    const p = await params;
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

  const data = await coversCollection.findOne({ _id: new ObjectId(p.id) });
    
   await coversCollection.updateOne(
      { _id: new ObjectId(p.id) },
      { $inc: { views: 1 } }
    );
  return NextResponse.json(data);
  
}

export async function DELETE(req, { params }) {
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
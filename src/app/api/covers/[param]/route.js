import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper to detect MongoDB ObjectId
const isObjectId = (id) =>
  ObjectId.isValid(id) && String(new ObjectId(id)) === id;

// ---------------- GET ----------------
export async function GET(req, context) {
  try {
    const params = await context.params;  // ✅ await params
    const param = params.param;

    if (!param)
      return NextResponse.json({ error: "Missing parameter" }, { status: 400 });

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Detect if param is an ObjectId or slug
    const query = isObjectId(param) ? { _id: new ObjectId(param) } : { slug: param };
    const cover = await coversCollection.findOne(query);

    if (!cover)
      return NextResponse.json({ error: "Cover not found" }, { status: 404 });

    // Increment views
    await coversCollection.updateOne(
      { _id: new ObjectId(cover._id) },
      { $inc: { views: 1 } }
    );

    // Fetch related products
    let related = [];
    if (cover.subCategory && cover.mainCategory) {
      related = await coversCollection
        .find({
          subCategory: { $regex: `^${cover.subCategory}$`, $options: "i" },
          mainCategory: { $regex: `^${cover.mainCategory}$`, $options: "i" },
          _id: { $ne: new ObjectId(cover._id) },
        })
        .limit(8)
        .toArray();
    }

    return NextResponse.json({ ...cover, related });
  } catch (error) {
    console.error("GET /covers/[param] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req, context) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await context.params;
    const param = params.param;

    if (!isObjectId(param))
      return NextResponse.json({ error: "Invalid ID for deletion" }, { status: 400 });

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);
    const result = await coversCollection.deleteOne({ _id: new ObjectId(param) });

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /covers/[param] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

// ---------------- PATCH ----------------
export async function PATCH(req, context) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await context.params;
    const param = params.param;

    if (!isObjectId(param))
      return NextResponse.json({ error: "Invalid ID for update" }, { status: 400 });

    const body = await req.json();
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    const result = await coversCollection.updateOne(
      { _id: new ObjectId(param) },
      { $set: body }
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Product updated" });
  } catch (error) {
    console.error("PATCH /covers/[param] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

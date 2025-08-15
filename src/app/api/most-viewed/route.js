import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export const GET = async () => {
  try {
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Find top 10 products with highest views
    const mostViewed = await coversCollection
      .find({ views: { $exists: true } }) // only those with views
      .sort({ views: -1 }) // highest first
      .limit(10)
      .toArray();

    return NextResponse.json(mostViewed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch most viewed products" }, { status: 500 });
  }
};

import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export const GET = async () => {
  try {
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Fetch the latest 10 products based on createdAt
    const newArrivals = await coversCollection
    .find() // Optional: only available items
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      newArrivals,
      count: newArrivals.length,
    });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

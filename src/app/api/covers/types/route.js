import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    // Use aggregation to get unique 'type' values
    const typesAggregation = await coversCollection.aggregate([
      { $group: { _id: "$type" } },
      { $sort: { _id: 1 } } // optional: sorts types alphabetically
    ]).toArray();

    // Map aggregation result to simple array of type strings
    const types = typesAggregation.map(t => t._id).filter(Boolean); // filter out null or undefined if any

    return NextResponse.json({ types });
  } catch (error) {
    console.error("Error fetching cover types:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

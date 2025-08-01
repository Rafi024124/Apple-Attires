import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || "";
    const coverType = url.searchParams.get('type') || "";  // <-- Read coverType here

    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 6;

    const skip = (page - 1) * limit;

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    let query = {};

    if (search) {
      // If search exists, build $or regex query
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { mainCategory: { $regex: search, $options: "i" } },
      ];
    }

    if (coverType) {
      // Add exact match for cover type (overrides regex type search if both present)
      query.type = coverType;
    }

    const totalCount = await coversCollection.countDocuments(query);

    const covers = await coversCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ covers, totalCount });
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

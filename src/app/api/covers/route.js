import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || "";
    const coverType = url.searchParams.get('type') || "";
    const sort = url.searchParams.get('sort') || "default";

    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 6;
    const skip = (page - 1) * limit;

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
        { mainCategory: { $regex: search, $options: "i" } },
        { models: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    if (coverType) {
      query.type = coverType;
    }

    // Sorting logic
    let sortOption = {};
    switch (sort) {
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "name_desc":
        sortOption = { name: -1 };
        break;
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "model_asc":
        sortOption = { "models.0": 1 }; // Sort by first model name
        break;
      case "model_desc":
        sortOption = { "models.0": -1 };
        break;
      default:
        sortOption = { createdAt: -1 }; // Default: Newest first
    }

    const totalCount = await coversCollection.countDocuments(query);

    const covers = await coversCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ covers, totalCount });
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

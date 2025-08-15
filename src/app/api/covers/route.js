import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// Simple in-memory cache store
const cache = new Map();
// Cache TTL in milliseconds
const CACHE_TTL = 30 * 1000; // 30 seconds

export const GET = async (request) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const coverType = url.searchParams.get("type") || "";
    const sort = url.searchParams.get("sort") || "default";
    const mainCategory = url.searchParams.get("mainCategory") || "";
    const subCategory = url.searchParams.get("subCategory") || "";
    const brand = url.searchParams.get("brand") || ""; // ✅ NEW
    const model = url.searchParams.get("model") || "";

    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 6;
    const skip = (page - 1) * limit;

   const modelsBySubCategory = {
  iphone: [
    "iphone-16-pro-max", "iphone-16-pro", "iphone-16-plus", "iphone-16",
    "iphone-15-pro-max", "iphone-15-pro", "iphone-15-plus", "iphone-15",
    "iphone-14-pro-max", "iphone-14-pro", "iphone-14-plus", "iphone-14",
    "iphone-13-pro-max", "iphone-13-pro", "iphone-13-mini", "iphone-13",
    "iphone-12-pro-max", "iphone-12-pro", "iphone-12-mini", "iphone-12",
    "iphone-11-pro-max", "iphone-11-pro", "iphone-11",
    "iphone-xs-max", "iphone-xs", "iphone-xr", "iphone-x",
    "iphone-8-plus", "iphone-8", "iphone-7-plus", "iphone-7",
    "iphone-6s-plus", "iphone-6s", "iphone-se-2022", "iphone-se-2020",
  ],
 samsung: [
  "galaxy-s25-ultra", "galaxy-s25+", "galaxy-s25",
  "galaxy-s24-ultra", "galaxy-s24+", "galaxy-s24",
  "galaxy-s23-ultra", "galaxy-s23+", "galaxy-s23",
  "galaxy-s22-ultra", "galaxy-s22+", "galaxy-s22",
  "galaxy-s21-ultra", "galaxy-s21+", "galaxy-s21",
  "galaxy-a74", "galaxy-a73", "galaxy-a72", "galaxy-a71",
  "galaxy-a54", "galaxy-a53", "galaxy-a52", "galaxy-a34", "galaxy-a33",
  "galaxy-a24", "galaxy-a14", "galaxy-z-fold-5", "galaxy-z-flip-5",
  "galaxy-note-20-ultra", "galaxy-note-20", "galaxy-note-10+", "galaxy-note-10",
]

};

 
const modelsForThisSubCategory = modelsBySubCategory[subCategory] || [];


    // Create cache key based on all query params
    const cacheKey = JSON.stringify({
      search,
      coverType,
      sort,
      mainCategory,
      subCategory,
      model,
      brand,
      page,
      limit,
    });
   const coversCollection = await dbConnect(
      collectionNamesObj.coversCollection
    );
      const countsAggregation = await coversCollection.aggregate([
  { $match: { mainCategory: "covers", subCategory: subCategory  } },
  { $unwind: "$models" },
  { $match: { models: { $in: modelsForThisSubCategory  } } },
  { $group: { _id: "$models", count: { $sum: 1 } } },
]).toArray();
    

const modelCounts = countsAggregation.map(c => ({
  model: c._id,
  count: c.count
}));

    // Check cache
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
      } else {
        cache.delete(cacheKey);
      }
    }

   

    let andConditions = [];

    // Search has priority
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { type: { $regex: search, $options: "i" } },
          { gender: { $regex: search, $options: "i" } },
          { subCategory: { $regex: search, $options: "i" } },
          { mainCategory: { $regex: search, $options: "i" } },
          { models: { $elemMatch: { $regex: search, $options: "i" } } },
          { brand: { $regex: search, $options: "i" } }, // ✅ include brand in search
        ],
      });
    } else {
      if (model) {
        andConditions.push({
          models: { $elemMatch: { $regex: `^${model}$`, $options: "i" } },
        });
      }
      if (mainCategory && subCategory) {
        andConditions.push({ mainCategory });
        andConditions.push({ subCategory });
      } else {
        if (mainCategory) andConditions.push({ mainCategory });
        if (subCategory) andConditions.push({ subCategory });
      }

      if (coverType) andConditions.push({ type: coverType });

      if (brand) andConditions.push({ brand }); // ✅ brand filter
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

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
        sortOption = { "models.0": 1 };
        break;
      case "model_desc":
        sortOption = { "models.0": -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const totalCount = await coversCollection.countDocuments(query);

    const covers = await coversCollection
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    const responseData = { covers, totalCount, modelCounts };

    // Save to cache
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate the body if needed
    if (!body.name || !body.images || !Array.isArray(body.images)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const coversCollection = await dbConnect(
      collectionNamesObj.coversCollection
    );

    const result = await coversCollection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting cover:", error);
    return NextResponse.json(
      { error: "Failed to insert cover" },
      { status: 500 }
    );
  }
}

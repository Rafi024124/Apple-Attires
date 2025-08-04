import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// Simple in-memory cache store
const cache = new Map();
// Cache TTL in milliseconds
const CACHE_TTL = 30 * 1000; // 30 seconds

export const GET = async (request) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || "";
    const coverType = url.searchParams.get('type') || "";
    const sort = url.searchParams.get('sort') || "default";
    const mainCategory = url.searchParams.get('mainCategory') || "";
    const subCategory = url.searchParams.get('subCategory') || "";
    const brand = url.searchParams.get('brand') || ""; // ✅ NEW

    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 6;
    const skip = (page - 1) * limit;

    // Create cache key based on all query params
    const cacheKey = JSON.stringify({ search, coverType, sort, mainCategory, subCategory, brand, page, limit });

    // Check cache
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
      } else {
        cache.delete(cacheKey);
      }
    }

    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

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
      
      if (mainCategory && subCategory) {
        andConditions.push({ mainCategory });
        andConditions.push({ subCategory });
      }else {
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

    const responseData = { covers, totalCount };

    // Save to cache
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

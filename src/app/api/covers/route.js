// File: src/app/api/covers/route.js
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);
    const covers = await coversCollection.find({}).toArray();
    return NextResponse.json(covers);
  } catch (error) {
    console.error("Error fetching covers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

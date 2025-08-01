import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (req, {params}) =>{
    const p = await params;
    const coversCollection = await dbConnect(collectionNamesObj.coversCollection);

  const data = await coversCollection.findOne({ _id: new ObjectId(p.id) });

  return NextResponse.json(data);
}
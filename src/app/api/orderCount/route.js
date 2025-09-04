import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

import { NextResponse } from 'next/server';


export async function GET(req){

    try {
        const ordersCollection = await dbConnect(collectionNamesObj.ordersCollection || "orders")
       
        const totalOrders = await ordersCollection.countDocuments();


        const salesAgg = await ordersCollection.aggregate([
            { $match: {status: "Delivered"}},
            {$group: {_id: null, total: {$sum: "$totalPrice"}}}
        ]).toArray();

        const totalSales = salesAgg[0]?.total || 0;

         return NextResponse.json({ totalOrders, totalSales });
    
    } catch (error) {
          console.error(error);
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
    }
}
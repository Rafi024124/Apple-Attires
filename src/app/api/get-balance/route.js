import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get("https://portal.packzy.com/api/v1/get_balance", {
      headers: {
        "Content-Type": "application/json",
        "API-KEY": process.env.STEADFAST_API_KEY,
        "SECRET-KEY": process.env.STEADFAST_API_SECRET,
      },
    });

    console.log(response.data);
    

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    console.error("Packzy Get Balance API Error:", err.response?.data || err.message);
    return NextResponse.json(
      err.response?.data || { error: err.message },
      { status: err.response?.status || 500 }
    );
  }
}

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const response = await axios.post(
      `${process.env.STEADFAST_BASE_URL}/create_order`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "API-KEY": process.env.STEADFAST_API_KEY,
          "SECRET-KEY": process.env.STEADFAST_API_SECRET,
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("Steadfast API Error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

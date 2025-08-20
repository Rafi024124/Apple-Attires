// app/api/bulk/check-process-status/route.js
import axios from "axios";

export async function POST(req) {
  try {
    const { process_id } = await req.json();

    if (!process_id) {
      return new Response(
        JSON.stringify({ error: "process_id is required" }),
        { status: 400 }
      );
    }

    const url = "https://fraudbd.com/api/bulk/check-process-status";

    const response = await axios.post(
      url,
      { process_id },
      {
        headers: {
          api_key: process.env.FRAUDBD_API_KEY,
          user_name: process.env.FRAUDBD_USERNAME,
          password: process.env.FRAUDBD_PASSWORD,
          "Content-Type": "application/json",
        },
      }
    );

    // Forward the FraudBD response
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (err) {
    console.error("FraudBD Check Process API Error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: err.response?.data || err.message }),
      { status: 500 }
    );
  }
}

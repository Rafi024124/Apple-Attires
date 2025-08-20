// app/api/fraud-check-bulk/route.js
import axios from "axios";

export async function POST(req) {
  try {
    const { phone_numbers } = await req.json();
    if (!phone_numbers?.length) {
      return new Response(JSON.stringify({ error: "Phone numbers required" }), { status: 400 });
    }

    const url = "https://fraudbd.com/api/bulk/check-courier-info";

    const response = await axios.post(
      url,
      { phone_numbers: phone_numbers.join(",") },
      {
        headers: {
          api_key: process.env.FRAUDBD_API_KEY,
          user_name: process.env.FRAUDBD_USERNAME,
          password: process.env.FRAUDBD_PASSWORD,
          "Content-Type": "application/json",
        },
      }
    );

    const result = {};
    if (Array.isArray(response.data)) {
      for (const item of response.data) {
        if (item.phone && item.Summaries) {
          // Summaries usually has courier info
          const summaryObj = {};
          for (const summary of item.Summaries) {
            summaryObj[summary.courier] = {
              total: summary.total,
              success: summary.success,
              cancel: summary.cancel,
            };
          }
          result[item.phone] = summaryObj;
        }
      }
    }

    return new Response(JSON.stringify({ status: true, result }), { status: 200 });
  } catch (err) {
    console.error("Bulk API Error:", err.response?.data || err.message);
    return new Response(JSON.stringify({ error: err.response?.data || err.message }), { status: 500 });
  }
}

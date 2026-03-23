import { json } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const { orderId } = req.query;

    // TODO: Fetch from database
    return json(res, 200, {
      success: true,
      orderId,
      status: "processing",
      pdf_url: ""
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Get report failed" });
  }
}

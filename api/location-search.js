import { json } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const q = req.query.q || "";
    if (!q || q.length < 3) return json(res, 200, { success: true, results: [] });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=5`,
      { headers: { "Accept": "application/json" } }
    );
    const data = await response.json();

    return json(res, 200, { success: true, results: data || [] });
  } catch (error) {
    return json(res, 500, { error: error.message || "Location search failed" });
  }
}

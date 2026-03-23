import { json, readJson } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);

    // TODO: Save free lead to database.
    return json(res, 200, {
      success: true,
      message: "Daily Rashifal request stored",
      lead: body
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Daily Rashifal failed" });
  }
}

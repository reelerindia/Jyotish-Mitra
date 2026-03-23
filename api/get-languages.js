import { PRODUCT_CONFIG } from "./_config.js";
import { json } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  const productType = req.query.productType;
  const config = PRODUCT_CONFIG[productType];
  if (!config) return json(res, 400, { error: "Invalid product type" });

  return json(res, 200, {
    success: true,
    productType,
    languages: config.languages
  });
}

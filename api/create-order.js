import { PRODUCT_CONFIG } from "./_config.js";
import { json, readJson } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const { productType, formData } = body;
    const config = PRODUCT_CONFIG[productType];
    if (!config) return json(res, 400, { error: "Invalid product type" });

    // TODO: Create Razorpay order here.
    // TODO: Save draft order to database.
    return json(res, 200, {
      success: true,
      productName: config.productName,
      amount: config.amount,
      currency: "INR",
      localOrderId: `JM_${Date.now()}`,
      razorpayOrderId: "replace_with_real_razorpay_order_id",
      keyId: process.env.RAZORPAY_KEY_ID || ""
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Create order failed" });
  }
}

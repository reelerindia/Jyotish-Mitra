import { json, readJson, verifyRazorpaySignature } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      localOrderId
    } = body;

    const ok = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET || ""
    );

    if (!ok) return json(res, 400, { error: "Invalid payment signature" });

    // TODO: Mark order as paid in database.
    return json(res, 200, {
      success: true,
      localOrderId,
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Verify payment failed" });
  }
}

import { json, readJson } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const { to, customerName, productName, pdfUrl } = body;

    // TODO: Connect Resend / SMTP here.
    return json(res, 200, {
      success: true,
      queued: true,
      message: `Email placeholder prepared for ${to}`,
      preview: { customerName, productName, pdfUrl }
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Send email failed" });
  }
}

import crypto from "crypto";

export function parseDob(dob) {
  const [year, month, day] = String(dob || "").split("-").map(Number);
  return { day, month, year };
}

export function parseTime(value) {
  const [hour, min] = String(value || "").split(":").map(Number);
  return { hour, min };
}

export function json(res, status, data) {
  res.status(status).json(data);
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => raw += chunk);
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

export function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  const digest = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return digest === signature;
}

export function authHeader(userId, apiKey) {
  return "Basic " + Buffer.from(`${userId}:${apiKey}`).toString("base64");
}

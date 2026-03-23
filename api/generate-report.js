import { PRODUCT_CONFIG, getBranding } from "./_config.js";
import { json, readJson, parseDob, parseTime, authHeader } from "./_utils.js";

function buildSinglePayload(formData, productType) {
  const dob = parseDob(formData.dob);
  const tob = parseTime(formData.birth_time);
  return {
    name: formData.name,
    gender: formData.gender,
    day: dob.day,
    month: dob.month,
    year: dob.year,
    hour: tob.hour,
    min: tob.min,
    lat: Number(formData.latitude),
    lon: Number(formData.longitude),
    tzone: Number(formData.timezone),
    place: formData.birth_place,
    language: formData.language,
    chart_style: formData.chart_style,
    ...getBranding()
  };
}

function buildMatchmakingPayload(formData) {
  const mDob = parseDob(formData.m_dob);
  const mTob = parseTime(formData.m_birth_time);
  const fDob = parseDob(formData.f_dob);
  const fTob = parseTime(formData.f_birth_time);

  return {
    m_first_name: formData.m_first_name,
    m_last_name: formData.m_last_name || "",
    m_day: mDob.day,
    m_month: mDob.month,
    m_year: mDob.year,
    m_hour: mTob.hour,
    m_min: mTob.min,
    m_latitude: Number(formData.m_latitude),
    m_longitude: Number(formData.m_longitude),
    m_timezone: Number(formData.m_timezone),
    m_place: formData.m_place,

    f_first_name: formData.f_first_name,
    f_last_name: formData.f_last_name || "",
    f_day: fDob.day,
    f_month: fDob.month,
    f_year: fDob.year,
    f_hour: fTob.hour,
    f_min: fTob.min,
    f_latitude: Number(formData.f_latitude),
    f_longitude: Number(formData.f_longitude),
    f_timezone: Number(formData.f_timezone),
    f_place: formData.f_place,

    language: formData.language,
    chart_style: formData.chart_style,
    ashtakoot: String(formData.ashtakoot) === "true",
    dashakoot: String(formData.dashakoot) === "true",
    papasamyam: String(formData.papasamyam) === "true",
    ...getBranding()
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = await readJson(req);
    const { productType, formData } = body;
    const config = PRODUCT_CONFIG[productType];
    if (!config) return json(res, 400, { error: "Invalid product type" });

    if (!config.languages.includes(formData.language)) {
      return json(res, 400, { error: "Language not available for this product" });
    }

    const payload = productType === "matchmaking"
      ? buildMatchmakingPayload(formData)
      : buildSinglePayload(formData, productType);

    const userId = process.env.ASTROLOGY_USER_ID || "";
    const apiKey = process.env.ASTROLOGY_API_KEY || "";

    // TODO: Replace URL if your plan uses another host / path.
    const response = await fetch(`https://pdf.astrologyapi.com/v1/${config.pdfEndpoint}`, {
      method: "POST",
      headers: {
        "Authorization": authHeader(userId, apiKey),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) return json(res, 400, { error: data.message || "PDF generation failed", raw: data });

    // TODO: Save pdf_url to database.
    return json(res, 200, { success: true, pdf_url: data.pdf_url || "", raw: data });
  } catch (error) {
    return json(res, 500, { error: error.message || "Generate report failed" });
  }
}

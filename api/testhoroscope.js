export default async function handler(req, res) {
  try {
    const sign = (req.query.sign || "aries").toLowerCase();

    const auth = "Basic " + Buffer.from(
  `${process.env.ASTROLOGY_USER_ID}:${process.env.ASTROLOGY_API_KEY}`
).toString("base64");

    const response = await fetch(
      `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`,
      {
        method: "POST",
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json",
          "Accept-Language": "en"
        },
        body: JSON.stringify({
          timezone: 5.5
        })
      }
    );

    const rawText = await response.text();

    let rawJson = null;
    try {
      rawJson = JSON.parse(rawText);
    } catch (e) {}

    return res.status(200).json({
      requested_sign: sign,
      request_url: `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`,
      astrology_status: response.status,
      astrology_ok: response.ok,
      user_id_used: process.env.ASTROLOGY_USER_ID || null,
      raw_text: rawText,
      raw_json: rawJson
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

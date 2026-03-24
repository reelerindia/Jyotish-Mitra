export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sign = (req.query.sign || "aries").toLowerCase();

    const validSigns = [
      "aries","taurus","gemini","cancer","leo","virgo",
      "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
    ];

    if (!validSigns.includes(sign)) {
      return res.status(400).json({ error: "Invalid zodiac sign" });
    }

    const response = await fetch(
      `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(
            `${process.env.ASTROLOGY_USER_ID}:${process.env.ASTROLOGY_API_KEY}`
          ).toString("base64"),
          "Content-Type": "application/json",
          "Accept-Language": "en"
        },
        body: JSON.stringify({})
      }
    );

    const raw = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Astrology API error",
        details: raw
      });
    }

    // Handle both API response formats
    const data = raw.prediction || raw;

    return res.status(200).json({
      sign,
      prediction: data.prediction || "",
      personal_life: data.personal_life || "",
      profession: data.profession || "",
      health: data.health || "",
      travel: data.travel || "",
      luck: data.luck || "",
      emotions: data.emotions || "",
      debug: raw
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}

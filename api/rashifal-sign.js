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

    const raw = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Astrology API error",
        status: response.status,
        raw
      });
    }

    const p = raw.prediction || raw;

    return res.status(200).json({
      sign,
      prediction: p.prediction || "",
      personal_life: p.personal_life || "",
      profession: p.profession || "",
      health: p.health || "",
      travel: p.travel || "",
      luck: p.luck || "",
      emotions: p.emotions || "",
      raw
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sign = (req.query.sign || "aries").toLowerCase();

    const validSigns = [
      "aries", "taurus", "gemini", "cancer", "leo", "virgo",
      "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
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

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Astrology API error",
        status: response.status,
        details: data
      });
    }

    return res.status(200).json({
      sign,
      prediction: data.prediction || "",
      personal_life: data.personal_life || "",
      profession: data.profession || "",
      health: data.health || "",
      emotions: data.emotions || "",
      travel: data.travel || "",
      luck: data.luck || ""
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}

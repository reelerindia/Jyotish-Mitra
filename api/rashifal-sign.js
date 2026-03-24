export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sign = (req.query.sign || "aries").toLowerCase();

    // Validate zodiac
    const validSigns = [
      "aries","taurus","gemini","cancer","leo","virgo",
      "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
    ];

    if (!validSigns.includes(sign)) {
      return res.status(400).json({ error: "Invalid zodiac sign" });
    }

    // Current date
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    // Astrology API endpoint
    const url = `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(
          `${process.env.ASTROLOGY_USER_ID}:${process.env.ASTROLOGY_API_KEY}`
        ).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ day, month, year })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "Astrology API error",
        details: data
      });
    }

    // Clean response for frontend
    return res.status(200).json({
      sign: sign,
      date: `${day}-${month}-${year}`,
      prediction: data.prediction || "",
      health: data.health || "",
      profession: data.profession || "",
      personal_life: data.personal_life || "",
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

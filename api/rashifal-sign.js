export default async function handler(req, res) {
  try {
    const sign = (req.query.sign || "aries").toLowerCase();

    const auth = "Basic " + Buffer.from(
      `${process.env.ASTROLOGY_USER_ID}:${process.env.ASTROLOGY_API_KEY}`
    ).toString("base64");

    const response = await fetch(
      `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`,
      {
        method: "POST", // 🔥 MUST BE POST
        headers: {
          "Authorization": auth,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({}) // 🔥 REQUIRED
      }
    );

    const data = await response.json();

    return res.status(200).json({
      sign,
      prediction: data.prediction || "",
      personal_life: data.personal_life || "",
      profession: data.profession || "",
      health: data.health || "",
      travel: data.travel || "",
      luck: data.luck || "",
      emotions: data.emotions || "",
      debug: data
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}

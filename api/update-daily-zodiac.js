import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SIGNS = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces"
];

export default async function handler(req, res) {
  try {
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0];

    for (const sign of SIGNS) {

      const response = await fetch(
        `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${sign}`,
        {
          method: "POST",
          headers: {
            "Authorization": "Basic " + Buffer.from(
              `${process.env.ASTROLOGY_USER_ID}:${process.env.ASTROLOGY_API_KEY}`
            ).toString("base64"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        }
      );

      const data = await response.json();

      await supabase.from("daily_zodiac_cache").upsert([
        {
          sign,
          date: dateKey,
          prediction: data.prediction,
          health: data.health,
          profession: data.profession,
          personal_life: data.personal_life,
          emotions: data.emotions,
          travel: data.travel,
          luck: data.luck
        }
      ], { onConflict: ["sign","date"] });

    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

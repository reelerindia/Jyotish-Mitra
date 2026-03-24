import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const sign = (req.query.sign || "aries").toLowerCase();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("daily_zodiac_cache")
      .select("*")
      .eq("sign", sign)
      .eq("date", today)
      .single();

    if (!data) {
      return res.status(404).json({ error: "No data yet" });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

import { json } from "./_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  try {
    const sign = String(req.query.sign || "aries").toLowerCase();

    // TODO: Replace with Astrology API horoscope endpoint
    return json(res, 200, {
      sign,
      summary: "Aaj ka din calm focus aur practical decisions ke liye accha hai.",
      personal_life: "Relationships me patience aur clear communication helpful rahega.",
      profession: "Step by step kaam karoge to progress dikhegi.",
      health: "Hydration aur rest ka dhyan rakho.",
      travel: "Short travel theek hai, unnecessary rush avoid karo.",
      luck: "Prepared efforts se better results milenge.",
      emotions: "Balanced rehne se clarity milegi."
    });
  } catch (error) {
    return json(res, 500, { error: error.message || "Rashifal failed" });
  }
}

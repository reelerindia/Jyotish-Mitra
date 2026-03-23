module.exports = async function handler(req, res) {
  res.status(200).json({
    summary: 'Aaj ka din calm focus aur practical decisions ke liye accha hai.',
    personal_life: 'Relationships me patience aur clear communication helpful rahega.',
    profession: 'Step by step kaam karoge to progress dikhegi.',
    health: 'Hydration aur rest ka dhyan rakho.',
    travel: 'Short travel theek hai, unnecessary rush avoid karo.',
    luck: 'Prepared efforts se better results milenge.',
    emotions: 'Balanced rehne se clarity milegi.'
  });
};

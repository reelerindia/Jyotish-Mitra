
const PRODUCT_LANGUAGES = {
  mini: [
    ["en", "English"], ["hi", "Hindi"], ["bn", "Bengali"], ["mr", "Marathi"],
    ["ta", "Tamil"], ["te", "Telugu"], ["kn", "Kannada"], ["ml", "Malayalam"]
  ],
  basic: [
    ["en", "English"], ["hi", "Hindi"], ["bn", "Bengali"], ["mr", "Marathi"],
    ["ta", "Tamil"], ["te", "Telugu"], ["kn", "Kannada"], ["ml", "Malayalam"]
  ],
  professional: [
    ["en", "English"], ["hi", "Hindi"]
  ],
  matchmaking: [
    ["en", "English"], ["hi", "Hindi"]
  ]
};

function initMenu(){
  const menuBtn = document.getElementById('menuBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  const servicesToggle = document.getElementById('servicesToggle');
  const servicesSub = document.getElementById('servicesSub');
  if (menuBtn && menuDropdown) {
    menuBtn.addEventListener('click', () => menuDropdown.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('open');
      }
    });
  }
  if (servicesToggle && servicesSub) {
    servicesToggle.addEventListener('click', () => servicesSub.classList.toggle('open'));
  }
}

function buildSingleCarousel(trackId, interval=2600){
  const track = document.getElementById(trackId);
  if (!track) return;
  let index = 0;
  const slides = track.children.length;
  const move = () => { track.style.transform = `translateX(-${index * 100}%)`; };
  setInterval(() => { index = (index + 1) % slides; move(); }, interval);
}

function populateLanguagesByProduct(productKey) {
  const selects = document.querySelectorAll('[data-language-select]');
  selects.forEach(select => {
    select.innerHTML = '<option value="">Select language</option>';
    const langs = PRODUCT_LANGUAGES[productKey] || [];
    langs.forEach(([code, name]) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = name;
      select.appendChild(opt);
    });
  });
}

function applyDefaultTimezone(){
  const offsetHours = -new Date().getTimezoneOffset() / 60;
  document.querySelectorAll('[data-timezone-default]').forEach(el => {
    if (!el.value) el.value = String(offsetHours);
  });
}

function createSuggestionsUI(input){
  let wrap = input.parentNode.querySelector('.suggestions');
  if (wrap) return wrap;
  wrap = document.createElement('div');
  wrap.className = 'suggestions';
  input.parentNode.appendChild(wrap);
  return wrap;
}

function attachPlaceAutocomplete(inputId, latId, lonId){
  const input = document.getElementById(inputId);
  const latInput = latId ? document.getElementById(latId) : null;
  const lonInput = lonId ? document.getElementById(lonId) : null;
  if (!input) return;
  input.parentElement.classList.add('suggest-wrap');
  const list = createSuggestionsUI(input);
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 3) {
      list.classList.remove('open');
      list.innerHTML = '';
      return;
    }
    timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=5`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          list.classList.remove('open');
          list.innerHTML = '';
          return;
        }
        list.innerHTML = data.map(item => `<div class="suggestion-item" data-name="${item.display_name.replace(/"/g,'&quot;')}" data-lat="${item.lat}" data-lon="${item.lon}">${item.display_name}</div>`).join('');
        list.classList.add('open');
        list.querySelectorAll('.suggestion-item').forEach(el => {
          el.addEventListener('click', () => {
            input.value = el.dataset.name;
            if (latInput) latInput.value = Number(el.dataset.lat).toFixed(6);
            if (lonInput) lonInput.value = Number(el.dataset.lon).toFixed(6);
            list.classList.remove('open');
          });
        });
      } catch (e) {
        list.classList.remove('open');
      }
    }, 250);
  });
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) list.classList.remove('open');
  });
}

async function openZodiacModal(sign, symbol, en, hi) {
  const overlay = document.getElementById('zodiacOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.getElementById('zodiacSymbol').textContent = symbol;
  document.getElementById('zodiacTitle').textContent = `${en} / ${hi}`;
  document.getElementById('zodiacLoader').style.display = 'block';
  document.getElementById('zodiacContent').style.display = 'none';
  try {
    const res = await fetch(`api/rashifal-sign.js?sign=${encodeURIComponent(sign)}`);
    const data = await res.json();
    document.getElementById('zodiacSummary').textContent = data.summary || 'Today carries steady useful energy.';
    document.getElementById('zPersonal').textContent = data.personal_life || 'Good energy in relationships.';
    document.getElementById('zProfession').textContent = data.profession || 'Work matters need focus.';
    document.getElementById('zHealth').textContent = data.health || 'Take care of rest and routine.';
    document.getElementById('zTravel').textContent = data.travel || 'Travel looks moderate.';
    document.getElementById('zLuck').textContent = data.luck || 'Luck supports preparation.';
    document.getElementById('zEmotion').textContent = data.emotions || 'Stay balanced and calm.';
  } catch (e) {
    document.getElementById('zodiacSummary').textContent = 'Unable to load live Rashifal right now.';
    document.getElementById('zPersonal').textContent = 'Focus on meaningful conversations.';
    document.getElementById('zProfession').textContent = 'Take one practical step today.';
    document.getElementById('zHealth').textContent = 'Rest and hydration matter.';
    document.getElementById('zTravel').textContent = 'Avoid rushing.';
    document.getElementById('zLuck').textContent = 'Luck follows preparation.';
    document.getElementById('zEmotion').textContent = 'Stay calm and centered.';
  }
  document.getElementById('zodiacLoader').style.display = 'none';
  document.getElementById('zodiacContent').style.display = 'block';
}

function closeZodiacModal() {
  const overlay = document.getElementById('zodiacOverlay');
  if (overlay) overlay.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  buildSingleCarousel('testimonialsTrack', 2800);
  buildSingleCarousel('blogsTrack', 3000);
  applyDefaultTimezone();
  attachPlaceAutocomplete('birth_place', 'latitude', 'longitude');
  attachPlaceAutocomplete('m_place', 'm_latitude', 'm_longitude');
  attachPlaceAutocomplete('f_place', 'f_latitude', 'f_longitude');
});

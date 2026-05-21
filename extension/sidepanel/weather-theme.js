
const WEATHER_CACHE_KEY = 'activify_weather_cache';
const LOCATION_CACHE_KEY = 'activify_location_cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const WMO_CODES = {
  // Clear/sunny
  0: 'clear',
  // Mainly clear, partly cloudy
  1: 'partlyCloudy',
  2: 'partlyCloudy',
  // Overcast/cloudy, fog
  3: 'cloudy',
  45: 'cloudy', // Fog
  48: 'cloudy', // Depositing rime fog
  // Drizzle, rain, freezing rain, rain showers
  51: 'rain', // Drizzle light
  53: 'rain', // Drizzle moderate
  55: 'rain', // Drizzle dense
  56: 'rain', // Freezing Drizzle light
  57: 'rain', // Freezing Drizzle dense
  61: 'rain', // Rain slight
  63: 'rain', // Rain moderate
  65: 'rain', // Rain heavy
  66: 'rain', // Freezing Rain light
  67: 'rain', // Freezing Rain heavy
  80: 'rain', // Rain showers slight
  81: 'rain', // Rain showers moderate
  82: 'rain', // Rain showers violent
  // Thunderstorm
  95: 'thunderstorm',
  96: 'thunderstorm', // with slight hail
  99: 'thunderstorm', // with heavy hail
  // Snow
  71: 'snow', // Snow fall slight
  73: 'snow', // Snow fall moderate
  75: 'snow', // Snow fall heavy
  77: 'snow', // Snow grains
  85: 'snow', // Snow showers slight
  86: 'snow'  // Snow showers heavy
};

const S = (pw, ph, ch) =>
  `<svg width="${pw}" height="${ph}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ch}</svg>`;

const THEMES = {
  clear: {
    accentH: 24, accentS: 94, accentL: 68,
    bgTint: 'hsla(24, 94%, 68%, 0.03)',
    svg: S(16, 16, '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>')
  },
  partlyCloudy: {
    accentH: 35, accentS: 70, accentL: 65,
    bgTint: 'hsla(35, 20%, 15%, 0.03)',
    svg: S(16, 16, '<path d="M12 2v2m-7 7H3m15 0h-2M5.6 5.6l1.4 1.4m10.4-1.4l-1.4 1.4"/><circle cx="12" cy="8" r="3"/><path d="M17.5 19H9a6 6 0 1 1 5.2-9.1A4.5 4.5 0 1 1 17.5 19Z"/>')
  },
  cloudy: {
    accentH: 210, accentS: 15, accentL: 65,
    bgTint: 'hsla(210, 10%, 20%, 0.04)',
    svg: S(16, 16, '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>')
  },
  rain: {
    accentH: 190, accentS: 60, accentL: 55,
    bgTint: 'hsla(210, 30%, 15%, 0.05)',
    svg: S(16, 16, '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M9.5 21l-1 2M12.5 21l-1 2M15.5 21l-1 2"/>')
  },
  thunderstorm: {
    accentH: 260, accentS: 20, accentL: 60,
    bgTint: 'hsla(240, 15%, 10%, 0.08)',
    svg: S(16, 16, '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M12 11l-2 6h3l-1 5"/>')
  },
  snow: {
    accentH: 200, accentS: 60, accentL: 75,
    bgTint: 'hsla(200, 30%, 20%, 0.04)',
    svg: S(16, 16, '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M9.5 20l1 1M12.5 20l1 1M15.5 20l1 1M10.5 22l1-1M13.5 22l1-1"/>')
  },
  night: {
    accentH: 220, accentS: 20, accentL: 65,
    bgTint: 'hsla(220, 30%, 10%, 0.1)',
    svg: S(16, 16, '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>')
  }
};

async function getCachedWeather() {
  const result = await chrome.storage.local.get(WEATHER_CACHE_KEY);
  const cache = result[WEATHER_CACHE_KEY];
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }
  return null;
}

async function setCachedWeather(data) {
  await chrome.storage.local.set({
    [WEATHER_CACHE_KEY]: { data, timestamp: Date.now() }
  });
}

async function getCachedLocation() {
  const result = await chrome.storage.local.get(LOCATION_CACHE_KEY);
  const cache = result[LOCATION_CACHE_KEY];
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }
  return null;
}

async function setCachedLocation(data) {
  await chrome.storage.local.set({
    [LOCATION_CACHE_KEY]: { data, timestamp: Date.now() }
  });
}

async function getLocationByIP() {
  const cached = await getCachedLocation();
  if (cached) return cached;

  const response = await fetch('https://ipinfo.io/json');
  if (!response.ok) throw new Error(`IP geolocation error: ${response.statusText}`);
  const data = await response.json();
  const parts = data.loc.split(',');
  if (parts.length !== 2) throw new Error(`IP geolocation fail: bad location "${data.loc}"`);

  const coords = { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) };
  await setCachedLocation(coords);
  return coords;
}

function getWeatherTheme(weatherData) {
  const currentHour = new Date().getHours();
  // Night override (6pm–6am local time)
  if (currentHour >= 18 || currentHour < 6) {
    return THEMES.night;
  }

  // Use Open-Meteo's is_day flag if available for more precise night detection
  if (weatherData && weatherData.current_weather && weatherData.current_weather.is_day === 0) {
     return THEMES.night;
  }

  if (weatherData && weatherData.current_weather) {
    const weathercode = weatherData.current_weather.weathercode;
    const themeKey = WMO_CODES[weathercode];
    if (themeKey && THEMES[themeKey]) {
      return THEMES[themeKey];
    }
  }

  // Fallback to a default clear/sunny theme if weather data is unavailable or code is unmapped
  return THEMES.clear;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--accent-h', theme.accentH);
  root.style.setProperty('--accent-s', theme.accentS + '%');
  root.style.setProperty('--accent-l', theme.accentL + '%');
  root.style.setProperty('--bg-tint', theme.bgTint);
  const weatherEmojiEl = document.getElementById('weather-emoji');
  if (weatherEmojiEl) {
    weatherEmojiEl.innerHTML = theme.svg;
  }
}

export async function applyWeatherTheme() {
  let weatherData = null;

  try {
    const cached = await getCachedWeather();
    if (cached) {
      weatherData = cached;
    } else {
      let coords;
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, enableHighAccuracy: false });
        });
        coords = position.coords;
      } catch (_geoError) {
        coords = await getLocationByIP();
      }

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`);
      if (!response.ok) throw new Error(`Weather API error: ${response.statusText}`);
      weatherData = await response.json();
      await setCachedWeather(weatherData);
    }
  } catch (error) {
    console.warn('[Activify] Weather unavailable, using time-based fallback:', error);
  }

  const theme = getWeatherTheme(weatherData);
  applyTheme(theme);
}

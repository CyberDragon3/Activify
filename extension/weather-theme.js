
const WEATHER_CACHE_KEY = 'activify_weather_cache';
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

const THEMES = {
  clear: {
    accentH: 24, accentS: 94, accentL: 68, // warm orange
    bgTint: 'hsla(24, 94%, 68%, 0.03)',
    emoji: '☀️'
  },
  partlyCloudy: {
    accentH: 35, accentS: 70, accentL: 65, // muted amber
    bgTint: 'hsla(35, 20%, 15%, 0.03)',
    emoji: '⛅'
  },
  cloudy: {
    accentH: 210, accentS: 15, accentL: 65, // cool gray
    bgTint: 'hsla(210, 10%, 20%, 0.04)',
    emoji: '☁️'
  },
  rain: {
    accentH: 190, accentS: 60, accentL: 55, // teal-blue
    bgTint: 'hsla(210, 30%, 15%, 0.05)',
    emoji: '🌧️'
  },
  thunderstorm: {
    accentH: 260, accentS: 20, accentL: 60, // purple-gray
    bgTint: 'hsla(240, 15%, 10%, 0.08)',
    emoji: '⛈️'
  },
  snow: {
    accentH: 200, accentS: 60, accentL: 75, // icy blue-white
    bgTint: 'hsla(200, 30%, 20%, 0.04)',
    emoji: '❄️'
  },
  night: {
    accentH: 220, accentS: 20, accentL: 65, // Consistent accent for night
    bgTint: 'hsla(220, 30%, 10%, 0.1)', // deep navy tint regardless of weather
    emoji: '🌙'
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
    weatherEmojiEl.textContent = theme.emoji;
  }
}

export async function applyWeatherTheme() {
  let weatherData = await getCachedWeather();

  if (!weatherData) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, enableHighAccuracy: false });
      });
      const { latitude, longitude } = position.coords;

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!response.ok) throw new Error(`Weather API error: ${response.statusText}`);
      weatherData = await response.json();
      await setCachedWeather(weatherData);

    } catch (error) {
      console.warn('[Activify] Failed to fetch weather data:', error);
      // Fail silently: keep default theme (which is "clear" if no theme is applied)
      applyTheme(THEMES.clear); // Explicitly apply clear theme if fetch fails
      return;
    }
  }

  const theme = getWeatherTheme(weatherData);
  applyTheme(theme);
}

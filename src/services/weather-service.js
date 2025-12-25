const axios = require("axios");

async function getWeatherData(city) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const { data } = await axios.get(url);
    
    return {
      temperature: data.main?.temp || 0,
      description: data.weather?.[0]?.description || "No description",
      coordinates: data.coord || { lon: 0, lat: 0 },
      feels_like: data.main?.feels_like || 0,
      wind_speed: data.wind?.speed || 0,
      country_code: data.sys?.country || "Unknown",
      // Safely check for rain. If it doesn't exist, return 0.
      rain_volume_3h: (data.rain && data.rain["3h"]) ? data.rain["3h"] : 0,
    };
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    throw new Error("Could not fetch weather data");
  }
}

module.exports = { getWeatherData };
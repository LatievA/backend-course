const axios = require("axios");

async function getWeatherData(city) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  const { data } = await axios.get(url);
  return {
    temperature: data.main.temp,
    description: data.weather[0].description,
    coordinates: data.coord,
    feels_like: data.main.feels_like,
    wind_speed: data.wind.speed,
    country_code: data.sys.country,
    rain_volume_3h: data.rain ? data.rain["3h"] || 0 : 0,
  };
}

module.exports = { getWeatherData };
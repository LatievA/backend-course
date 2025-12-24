require("dotenv").config();
const express = require("express");
const path = require("path");
const { getWeatherData } = require("./services/weather-service");
const { getNewsData } = require("./services/news-service");
const { getFactData } = require("./services/fact-service");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/report", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const [weather, news, fact] = await Promise.all([
      getWeatherData(city),
      getNewsData(city),
      getFactData(city),
    ]);

    res.json({ weather, news, fact });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from services" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
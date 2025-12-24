const axios = require("axios");

async function getNewsData(city) {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=${city}&pageSize=3&apiKey=${API_KEY}`;
    const { data } = await axios.get(url);

    return data.articles.map((article) => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
    }));
  } catch (error) {
    return []; // Return empty array so the whole app doesn't crash if news fails
  }
}

module.exports = { getNewsData };
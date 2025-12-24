const axios = require("axios");

async function getFactData(city) {
  try {
    const API_KEY = process.env.NINJA_API_KEY;
    const url = `https://api.api-ninjas.com/v1/city?name=${city}`;
    const { data } = await axios.get(url, {
      headers: { "X-Api-Key": API_KEY },
    });

    // Return the first match or a default object
    return (
      data[0] || {
        population: "N/A",
        is_capital: false,
      }
    );
  } catch (error) {
    return { error: "Fact service unavailable" };
  }
}

module.exports = { getFactData };
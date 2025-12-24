async function fetchData() {
  const city = document.getElementById("cityInput").value;
  const resultsDiv = document.getElementById("results");
  if (!city) return alert("Please enter a city");

  try {
    const response = await fetch(`/api/report?city=${city}`);
    const data = await response.json();

    resultsDiv.classList.remove("hidden");
    document.getElementById("cityName").innerText = city;

    // Render Weather
    document.getElementById("weatherContent").innerHTML = `
      <p>Temperature: ${data.weather.temperature}°C</p>
      <p>Condition: ${data.weather.description}</p>
      <p>Feels like: ${data.weather.feels_like}°C</p>
      <p>Wind: ${data.weather.wind_speed} m/s</p>
    `;

    // Render News
    const newsHtml = data.news
      .map((n) => `<p><a href="${n.url}" target="_blank">${n.title}</a></p>`)
      .join("");
    document.getElementById("newsContent").innerHTML =
      newsHtml || "No recent news found.";
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
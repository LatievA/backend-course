async function fetchData() {
  const city = document.getElementById("cityInput").value;
  const resultsDiv = document.getElementById("results");
  if (!city) return alert("Please enter a city");

  try {
    const response = await fetch(`/api/report?city=${city}`);
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    // Show results by removing Bootstrap's display-none class
    resultsDiv.classList.remove("d-none");
    document.getElementById("cityName").innerText = city;

    // Render Weather
    document.getElementById("weatherContent").innerHTML = `
      <ul class="list-unstyled">
        <li><strong>Temp:</strong> ${data.weather.temperature}°C</li>
        <li><strong>Feels Like:</strong> ${data.weather.feels_like}°C</li>
        <li><strong>Condition:</strong> ${data.weather.description}</li>
        <li><strong>Wind Speed:</strong> ${data.weather.wind_speed} m/s</li>
        <li><strong>Coordinates:</strong> Lon: ${data.weather.coordinates.lon}, Lat: ${data.weather.coordinates.lat}</li>
      </ul>
    `;

    // Render Facts
    document.getElementById("factContent").innerHTML = `
      <ul class="list-unstyled">
        <li><strong>Country:</strong> ${data.weather.country_code}</li>
        <li><strong>Population:</strong> ${data.fact.population?.toLocaleString() || "N/A"}</li>
        <li><strong>Is Capital:</strong> ${data.fact.is_capital ? "Yes" : "No"}</li>
      </ul>
    `;

    // Render News
    const newsHtml = data.news
      .map(
        (n) => `
        <a href="${n.url}" target="_blank" class="list-group-item list-group-item-action">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="mb-1 text-primary">${n.title}</h6>
          </div>
          <small class="text-muted">Source: ${n.source}</small>
        </a>`
      )
      .join("");
    document.getElementById("newsContent").innerHTML = newsHtml || "No news found.";
  } catch (err) {
    alert("Error fetching data. Check server logs or city name.");
    console.error(err);
  }
}
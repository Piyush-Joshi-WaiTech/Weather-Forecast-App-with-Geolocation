document
  .getElementById("darkModeToggle")
  .addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
  });

// Select the Current Location button
const locationButton = document.getElementById("currentLocationBtn");

// Function to fetch weather using geolocation
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        alert(
          "Unable to retrieve your location. Please check your location settings."
        );
        console.error("Geolocation error:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Function to fetch weather by latitude and longitude
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("Weather data not found for your location!");
      return;
    }

    // Update UI with location data
    cityNameEl.textContent = data.name;

    // Set timezone offset
    timezoneOffset = data.timezone;

    // Update time and start clock
    updateTime();
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);

    // ** Update Weather Details Box **
    document.querySelector(".temp h1").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(
      ".feels-like"
    ).textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    // Convert sunrise and sunset to local time
    document.querySelector(
      ".sun-timing .detail:nth-child(1) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunrise, timezoneOffset);
    document.querySelector(
      ".sun-timing .detail:nth-child(2) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunset, timezoneOffset);

    // Update Weather Icon & Condition
    const weatherCondition = data.weather[0].main;
    document.querySelector(".weather-condition").textContent = weatherCondition;
    document.querySelector(".large-weather-icon").src =
      getWeatherIcon(weatherCondition);

    // Update weather details
    document.querySelector(
      ".details-grid .detail:nth-child(1) span:last-child"
    ).textContent = `${data.main.humidity}%`;
    document.querySelector(
      ".details-grid .detail:nth-child(2) span:last-child"
    ).textContent = `${data.main.pressure} hPa`;
    document.querySelector(
      ".details-grid .detail:nth-child(3) span:last-child"
    ).textContent = `${data.wind.speed} km/h`;

    // Fetch and update 5-day and hourly forecasts
    fetchForecast(data.name);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Add event listener to the Current Location button
locationButton.addEventListener("click", fetchWeatherByLocation);

// 1st Box functionality:
const apiKey = "ac6277f2fdac4f62b9c4724ab3a54c40";
const searchInput = document.querySelector(".search-bar");
const cityNameEl = document.querySelector(".city-name");
const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");

let timezoneOffset = 19800;
let timeInterval;

// Function to fetch weather data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Update UI
    cityNameEl.textContent = data.name;

    // Set timezone offset
    timezoneOffset = data.sys.country === "IN" ? 19800 : data.timezone;

    // Update time and start clock
    updateTime();
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);

    // ** Update Weather Details Box **
    document.querySelector(".temp h1").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(
      ".feels-like"
    ).textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    // Convert sunrise and sunset to local time
    document.querySelector(
      ".sun-timing .detail:nth-child(1) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunrise, timezoneOffset);
    document.querySelector(
      ".sun-timing .detail:nth-child(2) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunset, timezoneOffset);

    // Update Weather Icon & Condition
    const weatherCondition = data.weather[0].main;
    document.querySelector(".weather-condition").textContent = weatherCondition;
    document.querySelector(".large-weather-icon").src =
      getWeatherIcon(weatherCondition);

    // ** Fix: Ensure elements exist before setting values **
    const humidityEl = document.querySelector(
      ".details-grid .detail:nth-child(1) span:last-child"
    );
    const pressureEl = document.querySelector(
      ".details-grid .detail:nth-child(2) span:last-child"
    );
    const windEl = document.querySelector(
      ".details-grid .detail:nth-child(3) span:last-child"
    );
    const uvEl = document.querySelector(
      ".details-grid .detail:nth-child(4) span:last-child"
    );

    if (humidityEl) humidityEl.textContent = `${data.main.humidity}%`;
    if (pressureEl) pressureEl.textContent = `${data.main.pressure} hPa`;
    if (windEl) windEl.textContent = `${data.wind.speed} km/h`;
    if (uvEl) uvEl.textContent = "N/A"; // UV Index (requires another API)
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// New Box :-

// Function to convert Unix timestamp to local time correctly
function formatTime(timestamp, timezoneOffset) {
  // Convert to milliseconds and adjust for local timezone
  const localTime = new Date((timestamp + timezoneOffset) * 1000);

  const hours = localTime.getUTCHours(); // Use UTC hours
  const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  return `${String(hours % 12 || 12).padStart(2, "0")}:${minutes} ${period}`;
}

// Function to return the correct weather icon based on condition
function getWeatherIcon(condition) {
  const icons = {
    Clear: "images/clear-1-98.png",
    Clouds: "images/clouds-2-28.png",
    Rain: "images/rain-1-55.png",
    Thunderstorm: "images/drizzle-1-59.png",
    Snow: "images/rain-1-55.png",
    Mist: "images/mist-1-67.png",
  };
  return icons[condition] || "images/clear-1-98.png";
}

// Function to update time continuously
function updateTime() {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  const hours = String(localTime.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");
  const period = localTime.getHours() >= 12 ? "PM" : "AM";

  timeEl.textContent = `${hours}:${minutes}:${seconds} ${period}`;
  dateEl.textContent = localTime.toDateString();
}

// Function to fetch weather data
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Update UI
    cityNameEl.textContent = data.name;

    // Set timezone offset
    timezoneOffset = data.sys.country === "IN" ? 19800 : data.timezone;

    // Update time and start clock
    updateTime();
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);

    // ** Update Weather Details Box **
    document.querySelector(".temp h1").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(
      ".feels-like"
    ).textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;

    // Convert sunrise and sunset to local time
    document.querySelector(
      ".sun-timing .detail:nth-child(1) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunrise, timezoneOffset);
    document.querySelector(
      ".sun-timing .detail:nth-child(2) .sun-text span:nth-child(2)"
    ).textContent = formatTime(data.sys.sunset, timezoneOffset);

    // Update Weather Icon & Condition
    const weatherCondition = data.weather[0].main;
    document.querySelector(".weather-condition").textContent = weatherCondition;
    document.querySelector(".large-weather-icon").src =
      getWeatherIcon(weatherCondition);

    // ** Fix: Ensure elements exist before setting values **
    const humidityEl = document.querySelector(
      ".details-grid .detail:nth-child(1) span:last-child"
    );
    const pressureEl = document.querySelector(
      ".details-grid .detail:nth-child(2) span:last-child"
    );
    const windEl = document.querySelector(
      ".details-grid .detail:nth-child(3) span:last-child"
    );
    const uvEl = document.querySelector(
      ".details-grid .detail:nth-child(4) span:last-child"
    );

    if (humidityEl) humidityEl.textContent = `${data.main.humidity}%`;
    if (pressureEl) pressureEl.textContent = `${data.main.pressure} hPa`;
    if (windEl) windEl.textContent = `${data.wind.speed} km/h`;
    if (uvEl) uvEl.textContent = "N/A"; // UV Index (requires another API)

    // Fetch and update 5-day forecast
    fetchForecast(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// ** Add fetchForecast function here **
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod !== "200") {
      alert("Forecast data not found!");
      return;
    }

    // Extract 5-day forecast from 3-hour intervals
    const dailyForecast = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = item;
      }
    });

    // Convert object to array and take the first 5 entries
    const forecastArray = Object.values(dailyForecast).slice(0, 5);

    // Select forecast container
    const forecastContainer = document.querySelector(".weather-forecast-box");
    forecastContainer.innerHTML = `<h2>5 Days Forecast:</h2>`;

    // Populate forecast data
    forecastArray.forEach((forecast) => {
      const temp = Math.round(forecast.main.temp);
      const dateStr = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      const weatherCondition = forecast.weather[0].main;
      const iconSrc = getWeatherIcon(weatherCondition);

      // Create forecast item
      const forecastItem = `
        <div class="forecast-item">
          <img src="${iconSrc}" alt="${weatherCondition}" />
          <span>${temp}°C</span>
          <span>${dateStr}</span>
        </div>
      `;
      forecastContainer.innerHTML += forecastItem;
    });
    updateHourlyForecast;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Function to update Hourly Forecast Box
function updateHourlyForecast(hourlyData) {
  const selectedHours = [12, 15, 18, 21, 0];
  const hourlyContainer = document.querySelector(".hourly-forecast-container");
  hourlyContainer.innerHTML = "";

  const filteredData = hourlyData.filter((item) => {
    const itemHour = new Date(item.dt * 1000).getHours();
    return selectedHours.includes(itemHour);
  });

  filteredData.forEach((hourly) => {
    const hour = new Date(hourly.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const temp = Math.round(hourly.main.temp);
    const windSpeed = Math.round(hourly.wind.speed);
    const weatherCondition = hourly.weather[0].main;
    const weatherIcon = getWeatherIcon(weatherCondition);
    const windIcon = "images/navigation-1-7.png"; // Placeholder, update if needed

    const hourlyItem = `
        <div class="hourly-item">
          <span>${hour}</span>
          <img src="${weatherIcon}" alt="${weatherCondition}" />
          <span>${temp}°C</span>
          <img src="${windIcon}" alt="Wind Direction" />
          <span>${windSpeed} km/h</span>
        </div>
      `;

    hourlyContainer.innerHTML += hourlyItem;
  });
}

// Event Listener for Search
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
    }
  }
});

// ** Ensure script runs after DOM is fully loaded **
document.addEventListener("DOMContentLoaded", function () {
  fetchWeather("Delhi");
});

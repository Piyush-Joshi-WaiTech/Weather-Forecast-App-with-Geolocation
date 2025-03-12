document
  .getElementById("darkModeToggle")
  .addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
  });

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
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Update UI
    cityNameEl.textContent = data.name;

    // **Fix: If city is in India, set timezone to IST (UTC+5:30)**
    if (data.sys.country === "IN") {
      timezoneOffset = 19800; // 5 hours 30 minutes in seconds
    } else {
      timezoneOffset = data.timezone; // Use API timezone for other countries
    }

    // Update time and start clock
    updateTime();
    clearInterval(timeInterval);
    timeInterval = setInterval(updateTime, 1000);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to update time continuously
function updateTime() {
  const now = new Date(); // Get the current local system time
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // Convert local time to UTC
  const localTime = new Date(utcTime + timezoneOffset * 1000); // Convert UTC to selected city's local time

  const hours = String(localTime.getHours() % 12 || 12).padStart(2, "0"); // Convert 24-hour to 12-hour format
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");
  const period = localTime.getHours() >= 12 ? "PM" : "AM"; // Determine AM/PM

  timeEl.textContent = `${hours}:${minutes}:${seconds} ${period}`; // Display time
  dateEl.textContent = localTime.toDateString(); // Display date
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

// **Load Delhi as the default city on page reload and continuously update time**
fetchWeather("Delhi");

// **Ensure time updates even before user searches a city**
timeInterval = setInterval(updateTime, 1000);

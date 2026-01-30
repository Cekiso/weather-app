// this file handle frontend logic

const apiKey = "56f3c158ca3d4058b3fee4e5f9b84920";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const cityInput = document.querySelector(".cityInput");
const searchBtn = document.querySelector(".searchBtn");
const weatherDisplay = document.querySelector(".weatherDisplay");

searchBtn.addEventListener("click", async event => {
    event.preventDefault();
    const city = cityInput.value;

    if(city){
        try{
            // Fetch both current weather and forecast
            const currentWeather = await fetchCurrentWeather(city);
            const forecast = await fetchForecast(city);
            
            displayTodayWeather(currentWeather);
            displayTodayHighlights(currentWeather);
            displayWeekForecast(forecast);
        }
        catch(error){
            console.error(error);
            displayError(error.message);
        }
    }
    else{
        displayError("Please enter a city");
    }
});

// Fetch current weather
async function fetchCurrentWeather(city){
    const response = await fetch(currentWeatherUrl + city + `&appid=${apiKey}`);
    
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }
    
    return await response.json();
}

// Fetch 5-day forecast
async function fetchForecast(city){
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    
    if(!response.ok){
        throw new Error("Could not fetch forecast data");
    }
    
    return await response.json();
}

// Display today's main weather
function displayTodayWeather(data){
    const {name: city, 
        main: {temp, feels_like}, 
        weather: [{description, id}]} = data;

    weatherDisplay.innerHTML = `
        <div class="weather-container">
            <div class="left-section">
                <div class="today-card">
                    <h1 class="cityDisplay">${city}</h1>
                    <p class="weatherEmoji">${getWeatherEmoji(id)}</p>
                    <p class="tempDisplay">${temp.toFixed(1)}°C</p>
                    <p class="descDisplay">${description}</p>
                    <p class="feelsLike">Feels like ${feels_like.toFixed(1)}°C</p>
                </div>
                
                <div class="forecast-section">
                    <h3>5-Day Forecast</h3>
                    <div class="forecast-grid" id="forecastGrid">
                    </div>
                </div>
            </div>
            
            <div class="right-section">
                <h3>Today's Highlights</h3>
                <div class="highlights-grid" id="highlightsGrid">
                </div>
            </div>
        </div>
    `;
}

// Display today's highlights (extra info)
function displayTodayHighlights(data){
    const {main: {humidity, pressure}, 
           wind: {speed},
           visibility,
           sys: {sunrise, sunset}} = data;

    const highlightsGrid = document.getElementById('highlightsGrid');
    
    highlightsGrid.innerHTML = `
        <div class="highlight-card">
            <p class="highlight-icon">💧</p>
            <p class="highlight-title">Humidity</p>
            <p class="highlight-value">${humidity}%</p>
        </div>
        <div class="highlight-card">
            <p class="highlight-icon">💨</p>
            <p class="highlight-title">Wind Speed</p>
            <p class="highlight-value">${speed} m/s</p>
        </div>
        <div class="highlight-card">
            <p class="highlight-icon">🌡️</p>
            <p class="highlight-title">Pressure</p>
            <p class="highlight-value">${pressure} hPa</p>
        </div>
        <div class="highlight-card">
            <p class="highlight-icon">👁️</p>
            <p class="highlight-title">Visibility</p>
            <p class="highlight-value">${(visibility / 1000).toFixed(1)} km</p>
        </div>
        <div class="highlight-card">
            <p class="highlight-icon">🌅</p>
            <p class="highlight-title">Sunrise</p>
            <p class="highlight-value">${new Date(sunrise * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
        </div>
        <div class="highlight-card">
            <p class="highlight-icon">🌇</p>
            <p class="highlight-title">Sunset</p>
            <p class="highlight-value">${new Date(sunset * 1000).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
        </div>
    `;
}

// Display week forecast
function displayWeekForecast(data){
    // Get one forecast per day (at 12:00 PM)
    const dailyForecasts = data.list.filter(item => 
        item.dt_txt.includes("12:00:00")
    ).slice(0, 5); // Get next 5 days

    const forecastGrid = document.getElementById('forecastGrid');
    let forecastHTML = '';

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = day.main.temp.toFixed(1);
        const weatherId = day.weather[0].id;

        forecastHTML += `
            <div class="forecast-card">
                <p class="forecast-day">${dayName}</p>
                <p class="forecast-emoji">${getWeatherEmoji(weatherId)}</p>
                <p class="forecast-temp">${temp}°C</p>
            </div>
        `;
    });

    forecastGrid.innerHTML = forecastHTML;
}

function displayError(message){
    weatherDisplay.innerHTML = `
        <p class="errorDisplay">${message}</p>
    `;
    weatherDisplay.style.display = "flex";
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "❓";
    }
}
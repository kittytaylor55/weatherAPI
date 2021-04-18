// Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. 
//The documentation includes a section called "How to start" that provides basic setup and usage instructions. 
//You will use `localStorage` to store any persistent data.


/* WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history


THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city */

function initPage() {
    const currentTempEl = document.getElementById("temperature");
    const currentUVEl = document.getElementById("uvIndex");
    const currentWindEl = document.getElementById("windSpeed");
    const currentHumidityEl = document.getElementById("humidity");
    const currentPicEl = document.getElementById("currentPicture");
    const nameEl = document.getElementById("cityName");
    const inputEl = document.getElementById("cityInput");
    const searchEl = document.getElementById("searchButton");
    const historyEl = document.getElementById("history");
    const clearEl = document.getElementById("clearHistory");
  
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
  
    const APIKey = "845929fce556ed611991487110985e81";
  
    function getWeather(cityName) {
      let queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&APPID=" +
        APIKey;
      axios.get(queryURL).then(function(response) {
        console.log(response);
  
        const currentDate = new Date(response.data.dt * 1000);
        console.log(currentDate);
  
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
  
        nameEl.innerHTML =
          response.data.name + "(" + month + "/" + day + "/" + year + ")";
  
        let weatherPicture = response.data.weather[0].icon;
  
        currentPicEl.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + weatherPicture + "@2x.png"
        );
        currentPicEl.setAttribute("alt", response.data.weather[0].description);
        currentTempEl.innerHTML =
          "Temparature: " + k2f(response.data.main.temp) + " &#176F";
        currentHumidityEl.innerHTML =
          "Humidity: " + response.data.main.humidity + "%";
        currentWindEl.innerHTML =
          "Wind Speed: " + response.data.wind.speed + " MPH";
  
        let latitude = response.data.coord.lat;
        let longitude = response.data.coord.lon;
  
        let uvQuery =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&APPID=" +
          APIKey +
          "&cnt=1";
        axios.get(uvQuery).then(function(response) {
          let uvIndex = document.createElement("span");
          uvIndex.setAttribute("class", "badge badge-danger");
          uvIndex.innerHTML = response.data[0].value;

//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

          currentUVEl.innerHTML = "UV Index: ";
          currentUVEl.append(uvIndex);
        });
  
        let cityID = response.data.id;
        let forecastQueryURL =
          "https://api.openweathermap.org/data/2.5/forecast?id=" +
          cityID +
          "&APPID=" +
          APIKey;
        axios.get(forecastQueryURL).then(function(response) {
          const forecastEl = document.querySelectorAll(".forecast");
          for (i = 0; i < forecastEl.length; i++) {
            forecastEl[i].innerHTML = "";
  
            const forecastIndex = i * 8 + 4;
            const forecastDate = new Date(
              response.data.list[forecastIndex].dt * 1000;
              console.log(currentDate);
            );
            //WHEN I view current weather conditions for that city
            //THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth();
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");
  
            
            
            
            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecastDate");
            forecastDateEl.innerHTML =
              forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEl[i].append(forecastDateEl);
  
            const forecastWeatherEl = document.createElement("img");
            forecastWeatherEl.setAttribute(
              "src",
              "https://openweathermap.org/img/wn/" +
                response.data.list[forecastIndex].weather[0].icon +
                "@2x.png"
            );
            forecastWeatherEl.setAttribute(
              "alt",
              response.data.list[forecastIndex].weather[0].description
            );
            forecastEl[i].append(forecastWeatherEl);
  
            const forecastTempEl = document.createElement("p");
            forecastTempEl.innerHTML =
              "Temp: " +
              k2f(response.data.list[forecastIndex].main.temp) +
              " &#176F";
            forecastEl[i].append(forecastTempEl);
  
            const forecastHumEl = document.createElement("p");
            forecastHumEl.innerHTML =
              "Humidity: " +
              response.data.list[forecastIndex].main.humidity +
              "%";
            forecastEl[i].append(forecastHumEl);
          }
        });
      });
    }
  
    searchEl.addEventListener("click", function() {
      const searchTerm = inputEl.value;
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search", JSON.stringify(searchHistory));
      renderSearchHistory();
    });
  
    clearEl.addEventListener("click", function() {
      searchHistory = [];
      renderSearchHistory();
    });
  
    // Convert K to F
    function k2f(K) {
      return Math.floor((K - 273.15) * 1.8 + 32);
    }
  
    function renderSearchHistory() {
      historyEl.innerHTML = "";
      for (let i = 0; i < searchHistory.length; i++) {
        const historyItem = document.createElement("input");
  
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("randomly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i]);
  
        historyItem.addEventListener("click", function() {
          getWeather(historyItem.value);
        });
        historyEl.append(historyItem);
      }
    }
  
    renderSearchHistory();
    if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
    }
  }
  initPage();
  
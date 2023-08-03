let cityName = document.getElementById("cityName");
let firstDayCondition = document.querySelector(".firstDayWeather .condition");
let firstDayDegree = document.querySelector(".firstDayWeather .degree");
let firstDayWeatherIcon = document.querySelector(
  ".firstDayWeather .weatherIcon"
);
let firstDayWind = document.querySelector(".firstDayWeather .wind");
let firstDayWeatherTitle = document.querySelector(
  ".firstDayWeather .firstDayWeatherTitle"
);
let secondDayWeather = document.querySelector(".secondDayWeather");
let thirdDayWeather = document.querySelector(".thirdDayWeather");
let searchCity = document.getElementById("searchCity");
let findBtn = document.querySelector(".findBtn");
let apiResponse;
let apiData;
let date = new Date();
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

async function getWeatherApi(city = "Kafr Ash Shaykh") {
  apiResponse = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=d3de10c756d44292b9b210129230308&q=${city}&days=3&aqi=no&alerts=no`
  );
  apiData = await apiResponse.json();
  displayFirstDayWeather();
  displayNextDaysWeather(1);
  displayNextDaysWeather(2);
}
getWeatherApi();
function displayFirstDayWeather() {
  firstDayWeatherTitle.innerHTML = `
        <span>${days[date.getDay()]}</span>
        <span>${date.getDate()} ${months[date.getMonth()]}</span>`;
  cityName.innerHTML = apiData.location.name;
  firstDayDegree.innerHTML = apiData.current.temp_c + `<sup>o</sup>C`;
  firstDayWeatherIcon.src = `http:` + apiData.current.condition.icon;
  firstDayCondition.innerHTML = apiData.current.condition.text;
  firstDayWind.innerHTML =
    `<img src="img/icon-wind.png" class="me-1">` + apiData.current.wind_kph;
}
function displayNextDaysWeather(dayNo) {
  let day = apiData.forecast.forecastday[dayNo].day;
  let whatToDisplay;
  let whatToDisplayClass;
  if (dayNo == 1) {
    whatToDisplay = secondDayWeather;
    whatToDisplayClass = "secondDayWeatherTitle";
  } else {
    whatToDisplay = thirdDayWeather;
    whatToDisplayClass = "thirdDayWeatherTitle";
  }
  whatToDisplay.innerHTML = `
    <div class=${whatToDisplayClass}>${days[(date.getDay() + dayNo) % 7]}</div>
    <div class="flex-nowrap align-items-center justify-content-center p-3">
      <img class="weatherIcon" src=http:${day.condition.icon}>
      <h4 class="degree my-3 ">${day.maxtemp_c}<sup>o</sup>C</h4>
      <h5 class=" my-3">${day.mintemp_c}<sup>o</sup>C</h5>
      <p class="condition">${day.condition.text}</p>
    </div>
    `;
}

searchCity.addEventListener("keyup", function () {
  getWeatherApi(searchCity.value);
});

findBtn.addEventListener("click", function () {
  getWeatherApi(searchCity.value);
});

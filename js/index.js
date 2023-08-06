let cityName = document.getElementById("cityName");
let firstDayCondition = document.querySelector(".firstDayWeather .condition");
let firstDayDegree = document.querySelector(".firstDayWeather .degree");
let firstDayWeatherIcon = document.querySelector(
  ".firstDayWeather .weatherIcon"
);
let country = document.getElementById("country");
let dir = document.getElementById("dir");
let firstDayWind = document.querySelector(".firstDayWeather .wind");
let firstDayWeatherTitle = document.querySelector(
  ".firstDayWeather .firstDayWeatherTitle"
);
let rain = document.getElementById("rain");
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
function getCoordintes() {
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude.toString();
		var lng = crd.longitude.toString();
		var coordinates = [lat, lng];
		getCity(coordinates);
		return;

	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
	var xhr = new XMLHttpRequest();
	var lat = coordinates[0];
	var lng = coordinates[1];

	xhr.open('GET', `
https://us1.locationiq.com/v1/reverse.php?key=pk.3af21b5c11eaa2162cb13b75ff60d08c&lat=` +
	lat + "&lon=" + lng + "&format=json", true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	xhr.addEventListener("readystatechange", processRequest, false);

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			var city = response.address.city;
			let mychoice=city;
      getWeatherApi(mychoice)
			return;
		}
	}
}

getCoordintes();


async function getWeatherApi(city) {
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
  var e = new Date(apiData.current.last_updated.replace(" ", "T"));

  firstDayWeatherTitle.innerHTML = `
        <span>${days[e.getDay()]}</span>
        <span>${e.getDate()} ${months[date.getMonth()]}</span>`;
  cityName.innerHTML = apiData.location.name;
  country.innerHTML = apiData.location.country;
  firstDayDegree.innerHTML = apiData.current.temp_c + `<sup>o</sup>C`;
  firstDayWeatherIcon.src = `http:` + apiData.current.condition.icon;
  firstDayCondition.innerHTML = apiData.current.condition.text;
  rain.innerHTML =
    `  <img src="img/icon-umberella.png" class="me-1" >
  ` +
    apiData.current.precip_mm +
    "%";
  firstDayWind.innerHTML =
    `<img src="img/icon-wind.png" class="me-1">` + apiData.current.wind_kph;
  if (apiData.current.wind_dir == "W") {
    dir.innerHTML = `<img src="img/icon-compass.png" class="me-1">` + "West";
  } else if (apiData.current.wind_dir == "E") {
    dir.innerHTML = `<img src="img/icon-compass.png" class="me-1">` + "East";
  } else if (apiData.current.wind_dir == "N") {
    dir.innerHTML = `<img src="img/icon-compass.png" class="me-1">` + "North";
  } else {
    dir.innerHTML = `<img src="img/icon-compass.png" class="me-1">` + "South";
  }
}
function displayNextDaysWeather(dayNo) {
  let day = apiData.forecast.forecastday[dayNo].day;
  let day1 = apiData.forecast.forecastday[dayNo].astro;
  let day2 = [];
  day2.push(apiData.forecast.forecastday[0].hour[9]);
  day2.push(apiData.forecast.forecastday[0].hour[13]);
  day2.push(apiData.forecast.forecastday[0].hour[21]);
  day2.push(apiData.forecast.forecastday[0].hour[0]);

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
      <p class="condition">Sunrise at ${day1.sunrise}</p>
      <ul class="d-flex bg-danger border-1 rounded-3">
      <li>At 9AM ${day2[0].temp_c}</li>
      <li>At 1PM ${day2[1].temp_c}</li>
      <li>At 9AM ${day2[2].temp_c}</li>
      <li>At 12PM ${day2[3].temp_c}</li>
    </ul>
    </div>
    `;
}

searchCity.addEventListener("keyup", function () {
  getWeatherApi(searchCity.value);
});

findBtn.addEventListener("click", function () {
  getWeatherApi(searchCity.value);
});

let x = document.querySelectorAll("nav .nav-item");
let test = document.getElementById("test");

x.forEach(function (ele, index) {
  ele.addEventListener("click", function (e) {
    console.log(e.target);
    if (!e.target) {
      test.classList.add("active");
    } else {
      test.classList.remove("active");
    }
  });
});

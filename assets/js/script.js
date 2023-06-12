var cityFormEl = document.querySelector('#city-form');
var historyButtonsEl = document.querySelector('#history-buttons')
var cityInputEl = document.querySelector('#city');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTerm = document.querySelector('#city-search-term');
var currentWeather = document.querySelector('#current-weather');
var forecastHeader = document.querySelector('#forecastheader')
var historyCities = [];

if(localStorage.getItem("history")) {
  historyCities = JSON.parse(localStorage.getItem("history"))
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  forecastHeader.classList.remove('hide');

  var cityName = cityInputEl.value.trim();

  citySearchTerm.textContent = (' for ' + cityName);

  console.log(cityName);

  getCurrentWeather(cityName)

};

var getCurrentWeather = function (city) {

  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=da83d8d5081b8e515102c6b434cac773`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          // console.log(data);
          // see if the city is already in local storage, if not add to local storage, then create and append button for it.


          var h2 = document.createElement('h2');
          h2.innerHTML = `
          ${data.name}
          <span>${(new Date(data.dt*1000))}<span>
          <img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'>
          `;
          currentWeather.appendChild(h2);
          var temp = document.createElement('p');
          temp.textContent = 'Temperature: ' + data.main.temp;
          currentWeather.appendChild(temp);
          var humidity = document.createElement('p');
          humidity.textContent = 'Humidity ' + data.main.humidity;
          currentWeather.appendChild(humidity);
          var windSpeed = document.createElement('p');
          windSpeed.textContent = 'Wind Speed ' + data.wind.speed + 'mph';
          currentWeather.appendChild(windSpeed);
          historyCities.push(data.name);
          localStorage.setItem('history', JSON.stringify(historyCities));
          showHistory()
          getWeatherForecast(city);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather API');
    });
};

var getWeatherForecast = function (city) {

  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=da83d8d5081b8e515102c6b434cac773`;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (res) {
          console.log(res);

          for (var i = 0; i < res.list.length; i+=8) {
            var data = res.list[i];
            var div = document.createElement('div');
            div.classList.add('div', 'card');
            forecastContainerEl.appendChild(div);
            var h2 = document.createElement('h2');
            h2.innerHTML = `
            <span>${(new Date(data.dt*1000))}<span>
            <img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'>
            `;
            div.appendChild(h2);
            var temp = document.createElement('p');
            temp.textContent = 'Temperature: ' + data.main.temp;
            div.appendChild(temp);
            var humidity = document.createElement('p');
            humidity.textContent = 'Humidity ' + data.main.humidity;
            div.appendChild(humidity);
            var windSpeed = document.createElement('p');
            windSpeed.textContent = 'Wind Speed ' + data.wind.speed + 'mph';
            div.appendChild(windSpeed);
          }
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather API');
    });
};

function showHistory(){
  historyButtonsEl.innerHTML= "";
  for(i=0; i<historyCities.length; i++){
    var newBtn = document.createElement('button');
    newBtn.textContent = historyCities[i]
    newBtn.addEventListener("click", function(e){
        getCurrentWeather(e.target.textContent);
    })
    historyButtonsEl.append(newBtn)
  }
}

showHistory()

cityFormEl.addEventListener('submit', formSubmitHandler);
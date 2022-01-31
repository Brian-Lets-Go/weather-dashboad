var cityList = [];
var cityName;
var apiKey = "a54f2a17bb00ab25d9743d47a124968d";
var lat;
var lon;
var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");
var forecastDiv = document.createElement("div");


initCityList();

function renderCities(){
    $("#cityList").empty();
    $("#cityInput").val("");
    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#cityList").prepend(a);
    } 
}

function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
    renderCities();
}

function storeCityArray() {

    localStorage.setItem("cities", JSON.stringify(cityList));

}

$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityName = $("#cityInput").val().trim();

    if(cityName === ""){
        alert("No city eneted. Please enter a city before searching.");

    }else if (cityList.length >= 8){  
        cityList.shift();
        cityList.push(cityName);

    }else{
    cityList.push(cityName);
    }
    getLatLong();
    storeCityArray();
    renderCities();

});

function historyDisplayWeather(){
    
    cityName = $(this).attr("data-name");
    getLatLong();
    // console.log(cityName);
    
}

$(".city").on("click", historyDisplayWeather);

function getLatLong() {

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

fetch(queryURL)
    .then(function (response) {

    if (!response.ok) {
        alert("Please enter a valid city name");

    } else if (response.ok) {
        // console.log(response);

        response.json().then(function (data) {
        // console.log(data);

        currentWeatherDiv.empty();

        //city name
        var getCityName = data.name
        var currentCityEl = document.createElement("h3");
        currentCityEl.setAttribute("class", "card-text");
        currentCityEl.textContent = getCityName;
        currentWeatherDiv.append(currentCityEl);


        //date
        var unixTimestamp = data.dt;
        var dateMilliseconds = unixTimestamp * 1000;
        var dateObject = new Date(dateMilliseconds);
        var humanDateEl = document.createElement("p");
        humanDate = dateObject.toLocaleString();
        humanDateEl.textContent = humanDate;
        humanDateEl.setAttribute("class", "card-text");
        currentWeatherDiv.append(humanDateEl);


        // icon for weather
        var i = 0
        var icon = data.weather[i].icon;
        var displayIcon = document.createElement("img");
        displayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");        
        var displayIconEl = document.createElement("div");
        displayIconEl.setAttribute("class", "card-text");
        displayIconEl.append(displayIcon);
        currentWeatherDiv.append(displayIconEl);
        
        
        lat = data.coord.lat;
        lon = data.coord.lon;

        // console.log (lat, lon);

        $("#weatherContainer").append(currentWeatherDiv);

        getOneCall ();

        })

     }})
}

function getOneCall () {

    var testURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(testURL)
        .then(function (response) {
        if (response.ok) {
            // console.log(response);
        response.json().then(function (data) {
        // console.log(data);
        
        //temperature
        var kelvin = data.current.temp;
        // console.log(kelvin);
        var farTemp = Math.floor(((kelvin - 273.15) * (9/5) + 32));
        farTemp = farTemp + " Degrees Farenheight";
        var farTempEl = document.createElement("p");
        farTempEl.setAttribute("class", "card-text");
        farTempEl.append(farTemp);
        currentWeatherDiv.append(farTempEl);


        //humidity
        var humidity = data.current.humidity;
        var humidPercent = "Humidity " + humidity + "%";
        var humidEl = document.createElement("p");
        humidEl.setAttribute("class", "card-text");
        humidEl.append(humidPercent);
        currentWeatherDiv.append(humidEl);

        //wind speed
        var wind = data.current.wind_speed;
        var windMph = wind*0.6213
        var roundedWind = Math.floor(windMph);
        var displayWind = roundedWind + " MPH";
        var windEl = document.createElement("p");
        windEl.setAttribute("class", "card-text");
        windEl.append(displayWind);
        currentWeatherDiv.append(windEl);


        //UV index
        var uvi = data.current.uvi;
        var uvIndexEl = document.createElement("p");
        uvIndexEl.setAttribute("class", "card-text");
        uvIndexEl.append(uvi);
        currentWeatherDiv.append(uvIndexEl);


        if (uvi >= 0 && uvi <= 3.99){
            uvIndexEl.setAttribute("class", "low");
        }else if(uvi >= 4 && uvi <= 8.99){
            uvIndexEl.setAttribute("class", "med");
        }else{
            uvIndexEl.setAttribute("class", "high");
        } 
    })}
})

fiveDayForecast()

}

// function clearForecatDiv() {

//     document.querySelector("#forecastContainer").clear();

// }

function fiveDayForecast () {

    forecastDiv.innerHTML = "";

    var testURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(testURL)
        .then(function (response) {
        if (response.ok) {
            console.log(response);
        response.json().then(function (data) {
        


        // var forecastDiv = document.createElement("div");
        var forecastHeader = document.createElement("h5");
        forecastHeader.innerHTML = "5 Day Forecast";
        forecastDiv.append(forecastHeader);
        var forecastCard = document.createElement("div");
        forecastCard.setAttribute("class", "card mb-3 mt-3");


        var cardDeck = document.createElement("div")
        cardDeck.setAttribute("class", "card-deck d-flex flex-row");
        forecastDiv.append(cardDeck);


        //loop
        for (var i = 1; i < 6; i++) {

            var cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");

            var cardDateUnix = data.daily[i].dt;
            var dateMilliseconds = cardDateUnix * 1000;
            var dateObject = new Date(dateMilliseconds);
            var humanDateEl = document.createElement("p");
            humanDate = dateObject.toLocaleString();
            humanDateEl.textContent = humanDate;
            humanDateEl.setAttribute("class", "card-text");
            cardBody.append(humanDateEl);

            //icon
            var icon = data.daily[i].weather[0].icon;
            var displayIcon = document.createElement("img");
            displayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");        
            var displayIconEl = document.createElement("div");
            displayIconEl.setAttribute("class", "card-text");
            cardBody.append(displayIcon);

            //temp
            var kelvin = data.daily[i].temp.day;
            var farTemp = Math.floor(((kelvin - 273.15) * (9/5) + 32));
            farTemp = farTemp + " Degrees Farenheight";
            var farTempEl = document.createElement("p");
            farTempEl.setAttribute("class", "card-text");
            farTempEl.append(farTemp);
            cardBody.append(farTempEl);

            //wind
            var wind = data.daily[i].wind_speed;
            var windMph = wind*0.6213
            var roundedWind = Math.floor(windMph);
            var displayWind = roundedWind + " MPH";
            var windEl = document.createElement("p");
            windEl.setAttribute("class", "card-text");
            windEl.append(displayWind);
            cardBody.append(windEl);

            //humidity
            var humidity = data.daily[i].humidity;
            var humidPercent = "Humidity " + humidity + "%";
            var humidEl = document.createElement("p");
            humidEl.setAttribute("class", "card-text");
            humidEl.append(humidPercent);
            cardBody.append(humidEl);

            cardDeck.append(cardBody);

        }

        document.querySelector("#forecastContainer").append(forecastDiv);


    })}
})
}



// Global variable declarations
var cityList = [];
var cityName;
var apiKey = "a54f2a17bb00ab25d9743d47a124968d";
var lat;
var lon;
var currentWeatherDiv = $("<div class='card-body' id='currentWeather'>");

initCityList();

// This function displays the city entered by the user into the DOM
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

// This function pulls the city list array from local storage
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
    renderCities();
}

// This function saves the city array to local storage
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

console.log(cityName);

var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

fetch(queryURL)
    .then(function (response) {

    if (!response.ok) {
        alert("Please enter a valid city name");

    } else if (response.ok) {
        // console.log(response);

        response.json().then(function (data) {
        console.log(data);

        currentWeatherDiv.empty();

        //city name
        var getCityName = data.name
        console.log(getCityName);
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
        console.log(humanDateEl);
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
            console.log(response);
        response.json().then(function (data) {
        console.log(data);
        
        //temperature
        var kelvin = data.current.temp;
        // console.log(kelvin);
        var farTemp = Math.floor(((kelvin - 273.15) * (9/5) + 32));
        farTemp = farTemp + " Degrees Farenheight";
        var farTempEl = document.createElement("p");
        farTempEl.setAttribute("class", "card-text");
        farTempEl.append(farTemp);
        console.log(farTemp);
        currentWeatherDiv.append(farTempEl);


        //humidity
        var humidity = data.current.humidity;
        var humidPercent = "Humidity " + humidity + "%";
        console.log(humidPercent);
        currentWeatherDiv.append(humidPercent);

        //wind speed
        var wind = data.current.wind_speed;
        var windMph = wind*0.6213
        var roundedWind = Math.floor(windMph);
        var displayWind = roundedWind + " MPH";
        console.log(displayWind);

        //UV index
        var uvi = data.current.uvi;
        console.log(uvi);



        

    })}
})}


// localStorage.setItem('tutor', JSON.stringify(testArray));
// var tutorName = JSON.parse(localStorage.getItem(testArray));

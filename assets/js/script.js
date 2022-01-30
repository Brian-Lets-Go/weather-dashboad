// Global variable declarations
var cityList = [];
var cityname;

$("#citySearchBtn").on("click", function(event){
    event.preventDefault();

    cityname = $("#cityInput").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (cityList.length >= 7){  
        cityList.shift();
        cityList.push(cityname);

    }else{
    cityList.push(cityname);
    }
})

console.log(cityname);

// var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=a54f2a17bb00ab25d9743d47a124968d";


// fetch(queryURL)
// .then(function (response) {
//   if (response.ok) {
//     console.log(response);
//     response.json().then(function (data) {
//       console.log(data);

//     })
//   }
// });


// //will use coordinates from above
// var exampleLat = "40.7143";
// var exampleLon = "-74.006";
// var apiKey = "a54f2a17bb00ab25d9743d47a124968d"

// var testURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${exampleLat}&lon=${exampleLon}&appid=${apiKey}`



// fetch(testURL)
// .then(function (response) {
//   if (response.ok) {
//     console.log(response);
//     response.json().then(function (data) {
//       console.log(data);

//       var iconUrl = `http://openweathermap.org/img/w/${icon}.png`

//     })
//   }
// });



// localStorage.setItem('tutor', JSON.stringify(testArray));
// var tutorName = JSON.parse(localStorage.getItem(testArray));

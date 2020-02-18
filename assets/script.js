let search = $("#city-search");
let searchBtn = $("#button");
let btnHistory = $("#city-buttons");
let cityName = $("#city-name");
let cityTemp = $("#city-temperature");
let cityHum = $("#city-humidity");
let cityWind = $("#city-windspeed");
let cityUV = $("#city-uvindex");
let cardDeck = $("#deck");

let count = 0;

//Main Function for a new search query
function newSearch(){
    //Initializing relevant variables and all the different URLs for different Ajax calls
    // IDEA: IF STATEMENT FOR IF SEARCH INFO IS NOT JUST EMPTY, THEN EMPTY SEARCH INFO. OTHERWISE USE VALUE OF BUTTON AS CITY
    var city = search.val();
    var queryURL= "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    var newCityBtn = $("<li class='btn btn-outline-secondary text-left list-group-item'>");
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        //Main display
        console.log(response);
        //IDEA ADD DATAS VALUE TO EACH NEW BUTTON AND HAVE A FOR LOOP COMPARE EVERY DATA VALUE TO NEW SEEARCH FIELD, RETURN IF MATCHES.
        newCityBtn.text(response.name);
        btnHistory.append(newCityBtn);
        cityName.text(response.name);
        var conversion = (response.main.temp - 273.15)*9/5 + 32;
        cityTemp.text(Math.floor(conversion) + "°F");
        cityHum.text(response.main.humidity + "%");
        cityWind.text(response.wind.speed);
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=f3e794b6f19299364c3a368c93f4e895&lat=" + latitude + "&lon="+ longitude;
        //Making an ajax request for the UV index
        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function(res){
            console.log(res);
            cityUV.text(res.value);
            if (res.value <= 4){
                cityUV.attr("class", "bg-success rounded");
            }else if (4<res.value && res.value<=7){
                cityUV.attr("class", "bg-warning rounded");
            }else if (7<res.value){
                cityUV.attr("class", "bg-danger rounded");
            }
        })
    });
    //Emptying the Deck for next iteration
    cardDeck.empty();
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(forecast){
        console.log(forecast);
        for (i=0; i<5;i++){
            var j=(i*7) + i;
            //Calling all variables foor the dynamically generated 5 day Forecast Cards
            var newCityCard = $("<div class = 'card text-white bg-primary' style = 'max-width: 18rem;'>");
            var newCardBody = $("<div class = 'card-body'>");
            var cardCity = $("<h5 class = 'card-title'>");
            var cardIcon;
            var cardIconCloudSun = $("<p class = 'card-text text-center'><i class='fas fa-cloud-sun'>");
            var cardIconSun = $("<p class='card-text text-center'><i class='fas fa-sun'>");
            var cardIconRain = $("<p class='card-text text-center'><i class='fas fa-cloud-showers-heavy'>");
            var cardIconCloud = $("<p class='card-text text-center'><i class='fas fa-cloud'>");
            var cardIconCloudSunRain = $("<p class='card-text text-center'><i class='fas fa-cloud-sun-rain'>");
            var cardIconSnow = $("<p class='card-text text-center'><i class='fas fa-snowflake'>");
            var classifier = forecast.list[j].weather[0].main;
            console.log(classifier);
            var cardTemp = $("<p class = 'card-text'>");
            var cardHum = $("<p class = 'card-text'>");
            //Modifying all variables with the information from the ajax request
            cardCity.text(forecast.city.name);
            //statements that determine the icon used
            if (classifier === "Clear"){
                cardIcon = cardIconSun;
            } else if (classifier === "Atmosphere"){
                cardIcon = cardIconCloudSun;
            } else if (classifier === "Clouds"){
                cardIcon = cardIconCloud;
            } else if (classifier === "Rain" || classifier === "Thunderstorm"){
                cardIcon = cardIconRain;
            } else if (classifier === "Snow"){
                cardIcon = cardIconSnow;
            } else {
                cardIcon = cardIconCloudSunRain;
            }
            var toF = (forecast.list[j].main.temp - 273.15)*9/5 +32;
            cardTemp.text("Temp: " + Math.floor(toF) + "°F");
            cardHum.text("Humidity: " + forecast.list[j].main.humidity + "%");
            newCardBody.append(cardCity);
            newCardBody.append(cardIcon);
            newCardBody.append(cardTemp);
            newCardBody.append(cardHum);
            newCityCard.append(newCardBody);
            cardDeck.append(newCityCard)
        }
    });
}
//click events
$(document).on("click", "button", newSearch);
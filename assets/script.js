let search = $("#city-search");
let searchBtn = $("#button");
let btnHistory = $("#city-buttons");
let cityName = $("#city-name");
let cityTemp = $("#city-temperature");
let cityHum = $("#city-humidity");
let cityWind = $("#city-windspeed");
let cityUV = $("#city-uvindex");
let cardDeck = $("#deck");
let currentTime = moment().format("(MM/DD/YYYY)")

let count = 0;
let cityCount = [];

//Main Function for a new search query
function newSearch(){
    //Initializing relevant variables and all the different URLs for different Ajax calls
    let city;
    //Checking to make sure that there's no repeated entry
    for (k=0; k<cityCount.length;k++){
        if(search.val().toLowerCase() === cityCount[k]){
            search.val('');
            return;
        }
    }
    let newCityBtn = $("<li class='btn btn-outline-secondary text-left list-group-item' id='button' data-history='" + count + "'>");
    if (search.val() !== ""){
        city = search.val();
        newCityBtn.text(city);
        btnHistory.append(newCityBtn);
        cityCount = cityCount.concat(search.val().toLowerCase());
        count++;
    } else {
        city = $(this).text();
    }
    let queryURL= "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    search.val('');
    console.log($(this).text());
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        //Main display
        console.log(response);
        cityName.text(response.name + " " + currentTime);
        let conversion = (response.main.temp - 273.15)*9/5 + 32;
        cityTemp.text(Math.floor(conversion) + "°F");
        cityHum.text(response.main.humidity + "%");
        cityWind.text(response.wind.speed);
        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=f3e794b6f19299364c3a368c93f4e895&lat=" + latitude + "&lon="+ longitude;
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
        });
    });
    //Emptying the Deck for next iteration
    cardDeck.empty();
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(forecast){
        console.log(forecast);
        for (i=0; i<5;i++){
            let j=(i*7) + i;
            //Calling all variables foor the dynamically generated 5 day Forecast Cards
            let newCityCard = $("<div class = 'card text-white bg-primary' style = 'max-width: 18rem;'>");
            let newCardBody = $("<div class = 'card-body'>");
            let cardDate = $("<h5 class = 'card-title'>");
            let cardIcon;
            let cardIconCloudSun = $("<p class = 'card-text text-center'><i class='fas fa-cloud-sun'>");
            let cardIconSun = $("<p class='card-text text-center'><i class='fas fa-sun'>");
            let cardIconRain = $("<p class='card-text text-center'><i class='fas fa-cloud-showers-heavy'>");
            let cardIconCloud = $("<p class='card-text text-center'><i class='fas fa-cloud'>");
            let cardIconCloudSunRain = $("<p class='card-text text-center'><i class='fas fa-cloud-sun-rain'>");
            let cardIconSnow = $("<p class='card-text text-center'><i class='fas fa-snowflake'>");
            let classifier = forecast.list[j].weather[0].main;
            console.log(classifier);
            let cardTemp = $("<p class = 'card-text'>");
            let cardHum = $("<p class = 'card-text'>");
            //Modifying all variables with the information from the ajax request
            cardDate.text(forecast.list[j].dt_txt);
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
            let toF = (forecast.list[j].main.temp - 273.15)*9/5 +32;
            cardTemp.text("Temp: " + Math.floor(toF) + "°F");
            cardHum.text("Humidity: " + forecast.list[j].main.humidity + "%");
            newCardBody.append(cardDate);
            newCardBody.append(cardIcon);
            newCardBody.append(cardTemp);
            newCardBody.append(cardHum);
            newCityCard.append(newCardBody);
            cardDeck.append(newCityCard)
        }
    });
}
//click events
$(document).on("click", "#button", newSearch);
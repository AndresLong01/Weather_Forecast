//Assigning all of the references to be appended and/or modified
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

//Created a count for data indexing using "data-history". This will only activate with the creation of new buttons.
let count = 0;
//Initialized an array to store new city information, so as not to repeat similar search results in the button history.
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
    //This conditional statement handles whether the click event comes from a new search term or just an older historic button
    if (search.val() !== ""){
        city = search.val();
        newCityBtn.text(city);
        cityCount = cityCount.concat(search.val().toLowerCase());
        count++;
    } else {
        city = $(this).text();
    }
    //URLs for 2 of my ajax requests
    let queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=f3e794b6f19299364c3a368c93f4e895";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        //Main display
        if (search.val() !== ""){
            btnHistory.append(newCityBtn);
        }
        search.val('');
        cityName.text(response.name + " " + currentTime);
        //Conversion from Kelvin
        let conversion = (response.main.temp - 273.15)*9/5 + 32;
        cityTemp.text(Math.floor(conversion) + "°F");
        cityHum.text(response.main.humidity + "%");
        cityWind.text(response.wind.speed);
        let latitude = response.coord.lat;
        let longitude = response.coord.lon;
        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=f3e794b6f19299364c3a368c93f4e895&lat=" + latitude + "&lon="+ longitude;
        //Making an ajax request for the UV index
        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function(res){
            cityUV.text(res.value);
            if (res.value <= 4){
                cityUV.attr("class", "bg-success rounded");
            }else if (4<res.value && res.value<=7){
                cityUV.attr("class", "bg-warning rounded");
            }else if (7<res.value){
                cityUV.attr("class", "bg-danger rounded");
            }
        });
    }).catch(function(err){
        cityCount.splice(count, 1);
        count--;
        alert("Something went wrong!");
    });
    //Above this line exists an exception for errors caught
    //Emptying the Deck for next iteration
    cardDeck.empty();
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(forecast){
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
            //conversion from Kelvin
            let toF = (forecast.list[j].main.temp - 273.15)*9/5 +32;
            cardTemp.text("Temp: " + Math.floor(toF) + " °F");
            cardHum.text("Humidity: " + forecast.list[j].main.humidity + "%");
            // Appending everything to its appropriate location
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
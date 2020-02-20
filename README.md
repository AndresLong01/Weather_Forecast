# Weather_Forecast
Small web page to show the weather forecast of any given city

Changelog:

1. Created the skeleton for my website (`index.html`)
2. Used the search info to create a dynamic element on the DOM and append it as a button in relation to the search term history.
3. With new buttons appended per search, created an Ajax request to the weather API. This specific API controls current weather for the search term used.
4. Replaced the text inside the skeleton with related information depending on the search term.
5. Added a moment.js date for the search that happens for current weather.
6. Added a UV Index with different breakpoints for high UV indexes or low ones showing up as different background colors. Used the UV Index API developed by the same organization and made a request to that URL inside the original request.
7. After the original request is done I started a request for the 5-day Forecast using the forecast API. Created Dynamic elements with each one that showed up
8. Created Logic to control repeated entries on the search bar as well as invalid ones.

Known Issues:

1. By nature of using free APIs some of the APIs used seem to have faulty servers, UV Index goes down frequently it has gone down 3 times in the time I worked on this project.
2. By nature of using a free API, the forecast API defaults to a 3-hour format of delivering information. dealt with this appropriately, however depending on the time of search, results may vary.
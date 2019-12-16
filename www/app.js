// the following object contains all the information that will be saved on the storage
var entry = {
    lat: null,
    lng: null,
    city: null,
    cityId: null,
    country: null,
    state: null,
    road: null,
    currency: null,
    quote: null,
    currencySymbol: null,
    currentTemp: null,
    feelsLike: null,
    maxTemp: null,
    minTemp: null,
    humidity: null,
    weatherDesc: null,
    dateRetrieved: null,
    forecast: {},
    image: null,
    flag: null
}

// initialize the app
var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    //when device is ready
    onDeviceReady: function () {
        console.log("DEVICE READY!!!")
        initialDisplay(); // start initial display
    }
};

// set the information of the opening page
function initialDisplay(){
    var last = getLastKey(); // retrieve last entry saved

if(last == 0){ // if there is no entries, retrieve new data
        console.log("Retrieving new values.");
        getLocation(); // get location
    }  else { // if there is something saved
        console.log("Loading from storage!");
        loadInfo(last); // load the last entry
        displayAllInfo(); // display info
    }
}

/**
 * Function to load info based on a key
 */
function loadInfo(key){
    var obj = getEntry(key); // retrieve entry from storage
    entry = obj; // load the information
}

/**
 * Function to clear the storage
 */
function clearStorage(){
    window.NativeStorage.clear(); // call clear function
    displayHistory(); // update the history information displayed
}

// Methods to get entries from the storage
function getEntry(key){
    var obj;
    window.NativeStorage.getItem(key, getSuccess, getError);
    function getSuccess(obj2){
        obj = obj2;
    }
    return obj;
}


function getError(error) {
    console.log(error.code);
    if (error.exception !== "") console.log(error.exception);
}

// Methods to save entries to the storage
function saveEntry(key,value){
    window.NativeStorage.setItem(key, value, setSuccess, setError);
}
// callback from above function on success
function setSuccess(obj) {
    console.log("Added: ", obj);
    displayAllInfo();
    ons.notification.alert('Saved.');
    displayHistory();
}

// callback from saveEntry() when an error occur
function setError(error) {
    console.log(error.code);
    if (error.exception !== "") console.log(error.exception);
}

// Methods to get all keys 
function getAllKeys(){
    var keys;
    window.NativeStorage.keys(keysSuccess2, keysError); // retrieve keys
    function keysSuccess2(obj){ // callback
        keys = obj;
    }
    // after testing, I verified the keys are not in order on the array retrieved. Therefore, it had to be sorted in descendent order.
    keys.sort(function(a, b){return b-a});
    console.log('keys', keys);
    return keys; // return ordered keys.
}

function keysError(error) {
    console.log("Error retrieving keys: ", error.code);
}

// Methods to remove entries from the storage
function removeEntry(key){
    var obj;
    windows.NativeStorage.remove(key, removeSuccess, removeError);
    function removeSuccess(obj2){
        obj = obj2;
    }
    console.log("Removed: "+obj);
    displayAllInfo();
    return obj;
}

function removeError(error) {
    console.log(error.code);
    if (error.exception !== "") console.log(error.exception);
}
/**
 * Function to save the current information to the storage.
 */
function saveInfo(){
    var lastKey = parseInt(getLastKey(), 10); //get last key
    var lastEntry = getEntry(lastKey);
    if (JSON.stringify(lastEntry) === JSON.stringify(entry)){
        console.log("Same object won't be saved twice.")
        ons.alert("Already saved.")
    } else {
        var nextId = (lastKey+1).toString(); // add one and transform into a string
        saveEntry(nextId, entry); // save using that ID
    }
}

/**
 * Function to get last key, using the getAllKeys() function.
 */
function getLastKey(){
    var keys = getAllKeys(); // get all keys
    var last = keys[0]; // get first one (descending ordered array)
    if (isNaN(last)){ // if the array is empty
        last = 0; // last is 0
    } else {
        last = keys[0]; // othewise it's the last one
    }  
    return last; // return
}

/**
 * Function useful for debugging, to print the current data to the console
 */
function printInfo(){
    var obj = getEntry(getLastKey());
    console.log("Printed:",obj);
}

/**
 * Function to get current geographic position
 */
function getLocation() {
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}
// callback from above function
function geoCallback(position) {
    const latitude = position.coords.latitude; // get coordinates
    const longitude = position.coords.longitude;
    entry.lat = latitude;// set to the variable
    entry.lng = longitude;

    getLocationInfo(); // get information based on the coordinates
}

/**
 * Function to the information about the location found.
 */
function getLocationInfo() {
    // call API
    var url = 'https://api.opencagedata.com/geocode/v1/json?q=' + entry.lat + '+' + entry.lng + '&key=1a35256819fb4283b6fda34b34459384&language=en';
    var http = new XMLHttpRequest();
    // when the even load is fired, it means the call was complete.
    http.addEventListener("load", getComplete);
    http.open("GET", url); // open request
    http.send(); // send request

    // when request is completed
    function getComplete(evt){
        var response = http.responseText; // get response
        var responseJSON = JSON.parse(response).results[0]; // parse JSON so we can actually read info

        entry.city = responseJSON.components.city; // get the info we need from json
        entry.country = responseJSON.components.country; 
        entry.state = responseJSON.components.state; 
        entry.road = responseJSON.components.road;
        entry.flag = responseJSON.annotations.flag;
        entry.currency = responseJSON.annotations.currency.iso_code;
        entry.currencySymbol = responseJSON.annotations.currency.symbol;
        entry.dateRetrieved = new Date().toLocaleString(); // get current date

        // call other functions
        getWeather(); // get current weather

        getCityId(); // used for the weather widget

        getConversionQuote(); // currency conversion
        
        getForecast(); // get weather forecast

    }
}

/**
 * Function to display map using iframe provided by Google.
 */
function displayMap(){
    // check if the information is available before displaying the map
    if (entry.lat != null && entry.lng != null)
    document.getElementById('mapdiv').innerHTML =
        "<iframe width=\"90%\" height=\"450\" frameborder=\"0\" style=\"border:0\"\r\n      src=\"https:\/\/www.google.com\/maps\/embed\/v1\/place?q=" + entry.lat + "," + entry.lng + "&key=AIzaSyA-u92AFVrRneKDg0Eb7BW9l_sLkRO_3Dk\"><\/iframe>\r\n";
}

/**
 * Helper function to round numbers (num) by (x) decimal places.
 * @param {int} num 
 * @param {int} X 
 */
function roundToX(num, X) {
    return +(Math.round(num + "e+" + X) + "e-" + X);
}

/**
 * Function to display all information.
 */
function displayAllInfo(){
    displayLocationInfo();// location metadata
    displayImage(); // image
    displayMap(); // map
    displayWeatherInfo(); // weather
    displayHistory(); // history
    displayWelcome(); // display flag
}

/**
 * Function to retrive forecast infomation, usin DarkSky API.
 */
function getForecast(){

    var url = 'https://api.darksky.net/forecast/04d8c0126426c602d7c40a3d58847429/' + entry.lat + ',' + entry.lng + '?exclude=minutely,hourly,currently,alerts,flags&units=si';
    var http = new XMLHttpRequest();
    http.addEventListener("load", getComplete); // when call is complete, fire getComplete
    http.open("GET", url); // open request
    http.send(); // send request

    function getComplete(evt) {
        var response = http.responseText; // get response
        var responseJSON = JSON.parse(response).daily.data; // parse JSON so we can actually read info
        entry.forecast = responseJSON; // save forecast
        console.log("Forecast: ",entry.forecast);
        displayForecast(); // display forecast
    }
 
}

/**
 * Function to display forecast
 */
function displayForecast(){
    // while information is not available
    while(console.log(Object.keys(entry.forecast).length === 0 && entry.forecast.constructor === Object)){
        setTimeout(function(){ // wait 500ms and display message to user
            document.getElementById('forecastdiv').innerHTML = "Loading forecast...";
        }, 500);
    }
    let result = '';

    // loop through the next 7 days, displaying the infomation in escaped ons-card component.
    for(var x = 1; x < 7; x++){
        result = result + '<ons-card>\r\n<div class=\"list-title\">'
        +getWeekDay(x)+'<\/div>\r\n<ul class=\"list\">\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">'
        +'High: '+entry.forecast[x].temperatureHigh+'°C'+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">'
        +'Low: '+entry.forecast[x].temperatureLow+'°C'+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">'
        +'Preciptation probability: '+(entry.forecast[x].precipProbability*100)+'%'+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" >'
        +'Summary: '+entry.forecast[x].summary+
        '<\/div>\r\n<\/li>\r\n<\/ul>\r\n<\/ons-card>';
    }
    // set information to div
    document.getElementById('forecastdiv').innerHTML = result;

}

/**
 * Helper function to retrieve the name of the day of the week by it's number. 0 = "Sunday"
 * @param {int} daysShift 
 */
function getWeekDay(daysShift){
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var d = new Date();
    var n = weekday[(d.getDay()+daysShift)%7];
    return n;
}


/**
 * Function to display the location history
 */
function displayHistory(){
    console.log("entry aqui: ", entry);
    let result = '';
    let keys = getAllKeys(); // get all keys
    console.log("keys history: ", keys)

    // for each key
    for(var x = 0; x<keys.length; x++){
        
        let currentEntry = getEntry(""+keys[x]); // get the entry
        console.log(currentEntry);

        // create escaped ons-card component using entry's info
        result = result + '<ons-card onclick=\"displayEntry('+keys[x]+')\">\r\n<div class=\"list-title\">'
        +currentEntry.dateRetrieved+
        '<\/div>\r\n<ul class=\"list\">\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">'
        +currentEntry.road+', '+currentEntry.city+', '+currentEntry.state+', '+currentEntry.country+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">Temperture: '
        +currentEntry.currentTemp+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">Weather condition: '
        +currentEntry.weatherDesc+
        '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\">Currency rate (USD to '+currentEntry.currency+'): '
        +currentEntry.quote+'<\/div>\r\n<\/li>\r\n<\/ul>\r\n<\/ons-card>';
    }


    document.getElementById('historydiv').innerHTML = ''; // clear div
    document.getElementById('historydiv').innerHTML = result; // add component
}

/**
 * Function to display given entry by it's key (ID).
 * @param {int} key 
 */
function displayEntry(key){
    console.log("Recebeu: ",key);
    loadInfo(key);
    hideWidget();
    displayAllInfo();
    ons.notification.alert('Information loaded.');
}

/**
 * Function to get weather information
 */
function getWeather() {
    // if coordinates were already retrieved
    if (entry.lat != null && entry.lng != null) {

        // call openweather API an retrieve data.
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + entry.lat + '&lon=' + entry.lng + '&appid=57c70879af088e4773d9d9be1637b94e&units=metric';
        var http = new XMLHttpRequest();
        http.addEventListener("load", getComplete); // when complete, call getComplete()
        http.open("GET", url); // open request
        http.send(); // send request
        function getComplete(){
            var response = http.responseText; // get response
            var responseJSON = JSON.parse(response); // parse JSON so we can actually read info
            console.log(responseJSON);
            entry.feelsLike = responseJSON.main.feels_like; // save needed info
            entry.currentTemp = responseJSON.main.temp;
            entry.maxTemp = responseJSON.main.temp_max;
            entry.minTemp = responseJSON.main.temp_min;
            entry.humidity = responseJSON.main.humidity;
            entry.weatherDesc = responseJSON.weather[0].description;
        };
    }
}

/**
 * Funtino to retrieve city id from coordinates - needed for the widget
 */
function getCityId() {
    // call api
    if (entry.lat != null && entry.lng != null) {

        var url = 'http://api.openweathermap.org/data/2.5/find?lat=' + entry.lat + '&lon=' + entry.lng + '&cnt=1&appid=57c70879af088e4773d9d9be1637b94e';
        var http = new XMLHttpRequest();
        http.addEventListener("load", getComplete);
        http.open("GET", url); // open request
        http.send(); // send request
        function getComplete() {
            var response = http.responseText; // get response
            var responseJSON = JSON.parse(response); // parse JSON so we can actually read info
            console.log('City ID ='+responseJSON.list[0].id);
            entry.cityId = responseJSON.list[0].id; // get the first item of the retrieved list.
            showWidget(); // display widget
        };
    }
}

/**
 * Function to display widget
 */
function showWidget(){
    // while information is not available
    while(entry.cityId == null){
        for(var x = 0; x < 15; x++){
            setTimeout(function(){ // wait 300 ms
                document.getElementById('openweathermap-widget-15').innerHTML = "<h3>Loading widget...</h3>";
                counter++;
            }, 300);    
        }
    }
    // if it is available
    if(entry.cityId != null) {
        // add widget (code provided by openweather api)
        window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  
        window.myWidgetParam.push({id: 15,cityid: entry.cityId ,appid: '57c70879af088e4773d9d9be1637b94e',units: 'metric',containerid: 'openweathermap-widget-15',  });  
        (function() {
            var script = document.createElement('script');
            script.async = true;
            script.charset = "utf-8";
            script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);  })();
    }

}

/**
 * Function to hide widget.
 */
function hideWidget(){
    document.getElementById('openweathermap-widget-15').innerHTML = '';
}
   
/**
 * Display weather info
 */
function displayWeatherInfo() {
    // if information is not available, wait
    while( entry.currentTemp == null ||
            entry.maxTemp == null ||
            entry.minTemp == null ||
            entry.humidity == null ||
            entry.weatherDesc == null
            ){

        setTimeout(function(){
            document.getElementById('weatherdiv').innerHTML = "Loading weather info..."
        },300);
    }

    // concatenate the HTML escaped code, using the information from entry and add to the desired div
    document.getElementById('currentconditionsdiv').innerHTML = '<div class=\"list-title\">Current conditions<\/div>\r\n   <ul class=\"list\">\r\n      <li class=\"list-item\">\r\n        <div class=\"list-item__center\" id=\"currenttemp\">'+
    'Temperature: ' + entry.currentTemp + '°C'+
    '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" id=\"feelslike\">'+
    'Feels like: ' + entry.feelsLike + '°C'+
    '<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" id=\"maxtemp\">'+
    'Max temperature: ' + entry.maxTemp + '°C'
    +'<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" id=\"mintemp\">'+
    'Min temperature: ' + entry.minTemp + '°C'
    +'<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" id=\"humidity\">'+
    'Humidity: ' + entry.humidity + '%'
    +'<\/div>\r\n<\/li>\r\n<li class=\"list-item\">\r\n<div class=\"list-item__center\" id=\"weatherdesc\">'+
    'Summary: ' + entry.weatherDesc
    +'<\/div>\r\n<\/li>\r\n<\/ul>';

}

/**
 * Function to display the location info (by divs)
 */
function displayLocationInfo() {
    document.getElementById('latdiv').innerHTML = 'Latitude: ' + entry.lat;
    document.getElementById('londiv').innerHTML = 'Longitude: ' + entry.lng;
    document.getElementById('datediv').innerHTML = 'Retrieved: ' + entry.dateRetrieved;
    document.getElementById('citydiv').innerHTML = 'City: ' + entry.city;
    document.getElementById('countrydiv').innerHTML = 'Country: ' + entry.country;
    document.getElementById('statediv').innerHTML = 'State: ' + entry.state;
    document.getElementById('roaddiv').innerHTML = 'Road: ' + entry.road;
    document.getElementById('currencydiv').innerHTML = 'Currency: ' + entry.currency;
    document.getElementById('secondcurrencyname').innerHTML = entry.currency + ' (' + entry.currencySymbol + ')';
}

/**
 * Function to get the conversion rate. APILayer API
 */
function getConversionQuote() {
    // call API Layer to retrieve information
    var url = 'http://apilayer.net/api/live?access_key=b068934ed17dd36bbd99f0b741397e5f&source=USD&currencies=' + entry.currency;
    var http = new XMLHttpRequest();
    http.addEventListener("load", getComplete); // when complete, call getComplete()
    http.open("GET", url); // open request
    http.send(); // send request

    function getComplete() {
        var response = http.responseText; // get response
        var responseJSON = JSON.parse(response); // parse JSON so we can actually read info
        console.log(responseJSON);
        var quotes = responseJSON.quotes; // get the info we need
        entry.quote = quotes['USD' + entry.currency]; // save info
        displayAllInfo(); // display all info
    };
}

// Convert from USD to local currency
function fromusd() {
    var dollars = Number(document.getElementById("usd").value); // get value typed by user
    var total = entry.quote * dollars; // convert value
    document.getElementById('otheramount').value = ''; // clear field (it was needed, because if user typed something, it wouldn't be overwritten)
    document.getElementById('otheramount').value = roundToX(total,2); // set converted value
    console.log(total); // print total to console
}

// Convert from local currency to USD
function tousd() {
    var other = document.getElementById("otheramount").value; // get value typed by user
    var total = other / entry.quote; // convert value
    document.getElementById('usd').value = ''; // clear field
    document.getElementById('usd').value = roundToX(total,2); // set converted value
    console.log(total); // print total to console
}

function onError(message) {
    console.log(message);
}

function pics(){
    navigator.camera.getPicture(cameraCallback, onErrorPic);
}

function cameraCallback(imageData){
    entry.image = imageData;
}

function displayImage(){
    if(entry.image != null) {
        var image = document.getElementById('myImage');
        image.src = entry.image;
    }
}

function onErrorPic(imageData){
    console.log("Error getting the image!!!");
    console.log(imageData);
}

function displayWelcome(){
    document.getElementById('welcometitle').innerHTML = 'Welcome to '+entry.city+', '+entry.country+'!';
    
    if(entry.flag!=null && entry.flag != undefined){
        document.getElementById('testflag').innerHTML = entry.flag;

    }
}

const userTab=document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorHandler=document.querySelector(".err-container");
const errorTabHandler=document.querySelector(".tab-container");
const h1Remover=document.querySelector(".heading");

let oldTab=userTab;
API_KEY='fc8734ede925686c93d5ed625fcdbf6d';
oldTab.classList.add('current-tab');
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=oldTab){
        oldTab.classList.remove('current-tab');
        oldTab=clickedTab;
        oldTab.classList.add('current-tab');

        if(!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();

        }

    }

}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem('user-coordinates');
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        errorHandler.classList.add("active");
        userInfoContainer.classList.remove("active");
        errorTabHandler.classList.add("inactive");
        h1Remover.classList.add("inactive");

    }
}

function renderWeatherInfo(weatherInfo){
    try{
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");

        cityName.innerText = weatherInfo?.name;
        countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText=weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

        if(weatherInfo?.name===undefined){
            alert("No Data Available");
            throw new Error();
        }

    }
    finally{

    }

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //alert send
        alert("we require access to your location");
    }

}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude

    }
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton=document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener('click',getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        
        loadingScreen.classList.remove("active");
        errorHandler.classList.add("active");
        searchForm.classList.remove("active");
        errorTabHandler.classList.add("inactive");
        h1Remover.classList.add("inactive");
        userInfoContainer.classList.remove("active");

    }
}
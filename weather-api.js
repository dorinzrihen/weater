
const kelvin = 273.16;
let cardWeather = {};

function weatherOptions(){
    const d = new Date();
    const hour = d.getHours();
    let option;
    if(hour>=18){
        option = {
            Clear:'/animated/night.svg',
            Clouds:'/animated/cloudy-night-1.svg',
            Rain:'/animated/rainy-5.svg',
        }
    }
    else{
        option = {
            Clear:'/animated/day.svg',
            Clouds:'/animated/cloudy-day-1.svg',
            Rain:'/animated/rainy-5.svg',
        }
    }
    return option;
}

async function fetchWeatherApi(api) {
    try{
        const res = await fetch(api);
        const data = await res.json();
        return data;
    }
    catch{
        msg.textContent = "something wrong, try again later";
    }
}
async function getApiByCityName(cityName){
    try{
        const data = await fetchWeatherApi(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=21cc8985dcb56222e056c7c649b11e0e`);

        const weatherCard = {
            name : data.name,
            temp : data.main.temp,
            weather : data.weather[0].main
        }
    
        setMiniCardInfo(weatherCard);
    }
    catch{
        msg.textContent = "something wrong, maybe typo"
    }

}

async function getApiByGeographicCoordinates(latitude,longitude){
    const data = await fetchWeatherApi(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=21cc8985dcb56222e056c7c649b11e0e`);

    const weatherCard = {
        name : data.name,
        temp : data.main.temp,
        weather : data.weather[0].main,
        sunrise : data.sys.sunrise,
        sunset : data.sys.sunset,
    }
    setCardInfo(weatherCard);
}



function getTime(unix){
    let date = new Date(unix*1000);
    return `${date.getHours()}:${date.getMinutes()}`
}

function setCardInfo(weatherCard){
    const weatherContainer = document.querySelector('.card-container__info');
    weatherContainer.appendChild(setInfo(weatherCard.name));
    weatherContainer.appendChild(setInfo(`${Math.floor(weatherCard.temp - kelvin)}°C`));
    weatherContainer.appendChild(setInfo(`Sunrise  ${getTime(weatherCard.sunrise)}`));
    weatherContainer.appendChild(setInfo(`Sunset  ${getTime(weatherCard.sunset)}`));
}

function setInfo(text){
    const info = document.createElement('p');
    info.textContent = text;
    return info;
}

function checkIfAlreadyExists(miniCardObj){
    if(cardWeather.hasOwnProperty(miniCardObj.name)){
        msg.textContent = "Already exists :)";
        return false;
    }
    else{
        cardWeather[miniCardObj.name] = miniCardObj;
        return true;
    }
    
}


function setMiniCardInfo(weatherCard){
    if(checkIfAlreadyExists(weatherCard)){
        const weatherContainer = document.querySelector('.weather-container');
        const miniWeatherCard = document.createElement('div');
        
        const infoCardSide = document.createElement('div');
        const svgPick = document.createElement('div');
        svgPick.classList.add('mini-card-img')
        miniWeatherCard.classList.add('card-container');
        infoCardSide.classList.add('mini-card');
        svgPick.innerHTML = `<img src="${weatherOptions()[weatherCard.weather]}" alt="">`
    
        infoCardSide.appendChild(setInfo(weatherCard.name));
        infoCardSide.appendChild(setInfo(`${Math.floor(weatherCard.temp - kelvin)}°C`));
        miniWeatherCard.appendChild(infoCardSide);
        miniWeatherCard.appendChild(svgPick);
        weatherContainer.appendChild(miniWeatherCard);
    }
}


//get current location
function geoFindMe() {  
    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
      getApiByGeographicCoordinates(latitude,longitude);
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if(!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
}
  



function getCityName(){
    const inputCity = document.querySelector('#weather-city');
    getApiByCityName(inputCity.value);

}

//current location function
geoFindMe();
const btnGetCity = document.querySelector('.get-city');
const msg = document.querySelector('.msg');
btnGetCity.addEventListener('click', getCityName);
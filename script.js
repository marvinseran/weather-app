let defaultCity = "Charleroi";
let units = "metric";
let ville = document.querySelector(".body__city");
let datetime = document.querySelector(".body__datetime");
let forecast = document.querySelector(".body__forecast");
let temperature = document.querySelector(".body__temperature");
let icon = document.querySelector(".body__icon");
let minmax = document.querySelector(".body__minmax");
let realfeel = document.querySelector(".card__realfeel");
let humidity = document.querySelector(".card__humidity");
let wind = document.querySelector(".card__wind");
let pressure = document.querySelector(".card__pressure");
let datetimeone = document.querySelector(".forecast__day__one__datetime");
let datetimetwo = document.querySelector(".forecast__day__two__datetime");
let datetimethree = document.querySelector(".forecast__day__three__datetime");
let datetimefour = document.querySelector(".forecast__day__four__datetime");
let datetimefive = document.querySelector(".forecast__day__five__datetime");
let forecastone = document.querySelector(".forecast__day__one__forecast");
let forecasttwo = document.querySelector(".forecast__day__two__forecast");
let forecastthree = document.querySelector(".forecast__day__three__forecast");
let forecastfour = document.querySelector(".forecast__day__four__forecast");
let forecastfive = document.querySelector(".forecast__day__five__forecast");
let iconone = document.querySelector(".forecast__day__one__icon");
let icontwo = document.querySelector(".forecast__day__two__icon");
let iconthree = document.querySelector(".forecast__day__three__icon");
let iconfour = document.querySelector(".forecast__day__four__icon");
let iconfive = document.querySelector(".forecast__day__five__icon");
let tempone = document.querySelector(".forecast__day__one__temperature")
let temptwo = document.querySelector(".forecast__day__two__temperature")
let tempthree = document.querySelector(".forecast__day__three__temperature")
let tempfour = document.querySelector(".forecast__day__four__temperature")
let tempfive = document.querySelector(".forecast__day__five__temperature")


document.querySelector(".header__search").addEventListener('submit',e => {
    let search = document.querySelector(".header__input");

    e.preventDefault();

    defaultCity = search.value;

    getInfo();
    updateForecast();
    
    search.value = "";
})

const cityInput = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestionsList');
let uniqueCitiesSet = new Set();

cityInput.addEventListener('input', () => {
    if (cityInput.value !== '') {
        suggestionsList.style.display = "block";
    } else {
        suggestionsList.style.display = "none";
    }
});
suggestionsList.addEventListener('click', (event) => {
    const selectedCity = event.target.textContent;
    cityInput.value = selectedCity;
    suggestionsList.style.display = "none";
});

cityInput.addEventListener('input', debounce(searchCities, 300));

async function searchCities() {
    const inputValue = cityInput.value.trim();

   
    suggestionsList.innerHTML = '';

    if (inputValue.length === 0) {
        return;
    }

    try {
        
        const apiKey = 'c0ecb266a24f4486a74fcbdb1294cf62'; 
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=3&appid=${apiKey}`);
        const data = await response.json();

        data.forEach(city => {
            if (!uniqueCitiesSet.has(city.name)) {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = `${city.name}, ${city.country}`;
                suggestionsList.appendChild(suggestionItem);

                uniqueCitiesSet.add(city.name);

                suggestionItem.addEventListener('click', () => {
                    cityInput.value = `${city.name}, ${city.country}`;
                    suggestionsList.innerHTML = '';
                    uniqueCitiesSet.clear(); 
                });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la recherche de villes :', error);
    }
}

function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}
document.querySelector(".header__units__celcius").addEventListener('click', () => {
    if(units !== "metric"){
        units="metric";
        getInfo();
        updateForecast();
    }
})
document.querySelector(".header__units__farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        units="imperial";
        getInfo();
        updateForecast();
    }
})
function convertTime(timestamp, timezone) {
    const convertTimezone = timezone / 3600;
    const date = new Date(timestamp * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    };
    return date.toLocaleString("fr-FR", options);
}

   async function getInfo() {
        const API_KEY = 'c0ecb266a24f4486a74fcbdb1294cf62';
    
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${API_KEY}&lang=fr&units=${units}`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
    
            ville.innerHTML = `${data.name}, ${(data.sys.country)}`;
            datetime.innerHTML = convertTime(data.dt, data.timezone);
            forecast.innerHTML = `${data.weather[0].description}`;
            temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">`
            minmax.innerHTML = `<span>Min: ${data.main.temp_min.toFixed()}&#176</span> <span>Max: ${data.main.temp_max.toFixed()}&#176</span> `
            realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
            humidity.innerHTML = `${data.main.humidity}%`
            wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph":"m/s"}`
            pressure.innerHTML = `${data.main.pressure} hPa`

        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des données météorologiques:', error);
        }
    }


document.addEventListener('DOMContentLoaded', getInfo);

document.querySelector(".forecast__arrow").addEventListener('click', () => {
    const forecastDays = document.querySelectorAll(".forecast__day");

    forecastDays.forEach(day => {

        if (day.style.display === "flex" || day.style.display === "") {

            day.style.display = "none";
        } else {

            day.style.display = "flex";
            day.style.flexDirection = "column";
            day.style.justifyContent = "space-between";
        }
    });
});


async function getCoordinatesByCity(cityName) {
    const apiKey = '26ad049a19dcc6c56c3a44a995ca90d01195c1a'; 

    try {
        const response = await fetch(`https://api.geocod.io/v1.6/geocode?q=${encodeURIComponent(cityName)}&api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }

        const dataforecast = await response.json();
        if (dataforecast.results && dataforecast.results.length > 0) {
            const coordinates = {
                lat: dataforecast.results[0].location.lat,
                lon: dataforecast.results[0].location.lng
            }
            const weatherData = await getWeatherByCoordinates(coordinates.lat, coordinates.lon);
            return coordinates;
        } else {
            throw new Error('Coordonnées introuvables pour la ville spécifiée.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des coordonnées:', error);
        throw error;
    }
}


async function getWeatherByCoordinates(lat, lon) {
    const apiKey = 'c0ecb266a24f4486a74fcbdb1294cf62'; 

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=fr&units=${units}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }

        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données météorologiques:', error);
        throw error;
    }
}
async function rechercheMeteoParVille(cityName) {
    try {
        console.log(`Début de la recherche pour ${cityName}`);
        const coordinates = await getCoordinatesByCity(cityName);
        console.log(`Coordonnées de ${cityName}:`, coordinates);

        const weatherData = await getWeatherByCoordinates(coordinates.lat, coordinates.lon);
        console.log(`Données météorologiques de ${cityName}:`, weatherData);
    } catch (error) {
        console.error('Une erreur s\'est produite:', error);
    }
}
async function updateForecast() {
    try {
        const coordinates = await getCoordinatesByCity(defaultCity);
        const weatherData = await getWeatherByCoordinates(coordinates.lat, coordinates.lon);

        datetimeone.innerHTML = convertTime(weatherData.list[6].dt, weatherData.city.timezone);
        datetimetwo.innerHTML = convertTime(weatherData.list[14].dt, weatherData.city.timezone);
        datetimethree.innerHTML = convertTime(weatherData.list[22].dt, weatherData.city.timezone);
        datetimefour.innerHTML = convertTime(weatherData.list[30].dt, weatherData.city.timezone);
        datetimefive.innerHTML = convertTime(weatherData.list[38].dt, weatherData.city.timezone);
        forecastone.innerHTML = `${weatherData.list[6].weather[0].description}`;
        forecasttwo.innerHTML = `${weatherData.list[14].weather[0].description}`;
        forecastthree.innerHTML = `${weatherData.list[22].weather[0].description}`;
        forecastfour.innerHTML = `${weatherData.list[30].weather[0].description}`;
        forecastfive.innerHTML = `${weatherData.list[38].weather[0].description}`;
        iconone.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.list[6].weather[0].icon}@4x.png">`
        icontwo.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.list[14].weather[0].icon}@4x.png">`
        iconthree.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.list[22].weather[0].icon}@4x.png">`
        iconfour.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.list[30].weather[0].icon}@4x.png">`
        iconfive.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.list[38].weather[0].icon}@4x.png">`
        tempone.innerHTML = `${weatherData.list[6].main.temp.toFixed()}&#176`;
        temptwo.innerHTML = `${weatherData.list[14].main.temp.toFixed()}&#176`;
        tempthree.innerHTML = `${weatherData.list[22].main.temp.toFixed()}&#176`;
        tempfour.innerHTML = `${weatherData.list[30].main.temp.toFixed()}&#176`;
        tempfive.innerHTML = `${weatherData.list[38].main.temp.toFixed()}&#176`;
        console.log(`Données météorologiques de ${defaultCity}:`, weatherData);
        console.log(`Mise à jour des prévisions pour ${defaultCity}`);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la mise à jour des prévisions:', error);
    }
}

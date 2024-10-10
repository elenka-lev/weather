import iziToast from "izitoast";
import iziToast from './node_modules/izitoast/dist/js/iziToast.min.js';
import axios from 'axios';
const BASE_URL_GEO = 'https://api.openweathermap.org/geo/1.0/direct';
const API_KEY = '25564df1c8dad9938ea89a52e68a0135';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getCoordinates(cityName) {
    try {
        const response = await axios.get(BASE_URL_GEO, {
            params: {
                q: cityName,
                limit: 1,
                appid: API_KEY
            }
        });
        const data = response.data[0];
      const { lat, lon } = data;
        return { lat, lon };
    } catch (error) {
        console.error('Ошибка получения координат:', error);
        throw error;
    }
};
async function getWeather({ lat, lon }) {
  try {
    const resp = await axios.get(WEATHER_API_URL, {
      params: {
        lat: lat,
        lon: lon,
        units: 'metric',
        appid: API_KEY
      }
    })
    const weatherData = resp.data;
        console.log(weatherData);
        return weatherData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
async function getWeatherForCity(cityName) {
    try {
        const coordinates = await getCoordinates(cityName);
        const weatherData = await getWeather(coordinates);
        renderWeather(weatherData);
    } catch (error) {
        console.error('Ошибка при получении погоды для города:', error);
    }
}

//render
function renderWeather(weatherData) {
    const { name, main: { temp }, wind: { speed, deg }, weather: [{ description, icon }] } = weatherData;
  const weatherGrid = document.querySelector('.weather-grid');
  const dataLoc = new Date().toLocaleDateString();
  const markup = `<div class="wrapper">
            <section class="city">
                <div class="container">
                    <div class="city-info">
                        <ul class="today-main">
                            <li class="today-city">${name}</li> 
                            <li class="today-date">${dataLoc}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="weather-info">
                <div class="container container-weather-info">
                    <div class="weather-wrap">
                        <ul class="weather-descr">
                            <li class="weather-degrees">${Math.round(temp)} <span class="degrees">°C</span></li>
                            <li class="wind-speed">${speed}<span class="speed"> km/h</span></li>
                            <li class="wind-direction">${deg}°</li>
                        </ul>
                        <ul class="weather-forecast">
                            <li class="weather-icon">
                                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="icon" width="240" height="240">
                            </li>
                            <li class="weather-condition">${description}</li>
                        </ul>
                    </div>
                </div>
             </section>
        </div>`
  weatherGrid.insertAdjacentHTML('beforeend', markup);
}


const form = document.querySelector('.form');

form.addEventListener('submit', async event => {
  event.preventDefault();

  const cityValue = form.elements.query.value.trim();
  const weatherGrid = document.querySelector('.weather-grid')
  if (cityValue === '') {
    iziToast.error({
            title: '',
            message: 'Sorry. Please try again!',
            position: 'topRight',
            backgroundColor: '#EF4040',
            maxWidth: '432px',
            messageColor: '#fff',
            iconColor: '#fff'
        });
        return;
  }
  weatherGrid.innerHTML = '';
  try {
    await getWeatherForCity(cityValue);
  } catch (error) {
    iziToast.error({
      title: '',
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
      backgroundColor: '#EF4040',
      maxWidth: '432px',
      messageColor: '#fff',
      iconColor: '#fff'
    });
        
  } finally {
    form.reset();
  }
})
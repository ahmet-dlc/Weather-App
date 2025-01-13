const apiKeyWeather = '603bb01fa7e23b8caceedc9f8efcab68';
const apiKeyGiphy = 'RGsEHWgzcLYuf6OlD5YcMH7S5D5CHeb9';

let unit = 'metric';

document.querySelector('form').addEventListener('submit', getWeather);
document.getElementById('unit-toggle').addEventListener('click', toggleUnit);

function getWeather(event) {
  event.preventDefault();
  
  const location = document.querySelector('#location').value;
  
  if (!location) return;
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKeyWeather}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      if (data.weather && data.weather.length > 0) {
        const weather = data.weather[0].description;
        displayWeather(data);
        getGif(weather);
      } else {
        alert('Weather data not available');
      }
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      document.getElementById('weather-info').innerHTML = 'Error fetching weather data';
    });
}

function displayWeather(data) {
  const temp = unit === 'metric' ? data.main.temp : (data.main.temp * 9/5) + 32;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;

  document.getElementById('weather-info').innerHTML = `
    <p>Location: ${data.name}</p>
    <p>Temperature: ${temp.toFixed(1)}°${unit === 'metric' ? 'C' : 'F'}</p>
    <p>Weather: ${description}</p>
    <p>Humidity: ${humidity}%</p>
  `;
}

function getGif(weather) {
  const gifUrl = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKeyGiphy}&s=${weather}`;

  fetch(gifUrl)
    .then(response => response.json())
    .then(giphyData => {
      if (giphyData.data && giphyData.data.images && giphyData.data.images.original.url) {
      
        document.body.style.backgroundImage = `url(${giphyData.data.images.original.url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
      } else {
        console.error('GIF not found for weather:', weather);
      }
    })
    .catch(error => {
      console.error('Error fetching GIF:', error);
    });
}

function toggleUnit() {
  unit = unit === 'metric' ? 'imperial' : 'metric';
  const unitLabel = unit === 'metric' ? 'Celsius' : 'Fahrenheit';
  document.getElementById('unit-label').innerText = `Unit: ${unitLabel}`;

  getWeather(new Event('submit'));
}

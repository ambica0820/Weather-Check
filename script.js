
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weatherResult');

weatherForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    weatherResult.textContent = 'Loading weather...';

    try {
        // Get the city's location
        const geocodingURL =
            'https://geocoding-api.open-meteo.com/v1/search?name='
            + encodeURIComponent(city)
            + '&count=10&language=en&format=json&countryCode=US&feature_code=PPL';

        const response = await fetch(geocodingURL);

        if (!response.ok) {
            throw new Error('Could not search for this city.');
        }

        const data = await response.json();

        // Check whether the city was found
        if (!data.results || data.results.length === 0) {
            weatherResult.textContent =
                'City not found. Please try another U.S. city.';
            return;
        }

        // Get the city's coordinates
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        // Get the weather data in U.S. units
        const weatherURL =
            'https://api.open-meteo.com/v1/forecast?latitude='
            + latitude
            + '&longitude='
            + longitude
            + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m'
            + '&temperature_unit=fahrenheit'
            + '&wind_speed_unit=mph';

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error('Could not retrieve weather data.');
        }

        const weatherData = await weatherResponse.json();

        // Display the weather
        weatherResult.innerHTML =
            '<h2>Weather in ' + data.results[0].name + '</h2>' +
            '<p>Temperature: '
            + weatherData.current.temperature_2m + ' °F</p>' +
            '<p>Feels like: '
            + weatherData.current.apparent_temperature + ' °F</p>' +
            '<p>Humidity: '
            + weatherData.current.relative_humidity_2m + '%</p>' +
            '<p>Wind speed: '
            + weatherData.current.wind_speed_10m + ' mph</p>';

    } catch (error) {
        weatherResult.textContent =
            'Something went wrong while fetching the weather. Please try again.';

        console.error(error);
    }
});

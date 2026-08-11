/* =====================================================
   NURTURED BY MEL
   External API JavaScript Module
   Final Web Application Project
   ===================================================== */


/* =====================================================
   API URLS
   ===================================================== */

const QUOTE_API =
    "https://api.quotable.io/random";

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =====================================================
   QUOTE ELEMENTS
   ===================================================== */

const quoteText =
    document.querySelector("#api-quote");

const quoteAuthor =
    document.querySelector("#api-author");

const newQuoteButton =
    document.querySelector("#new-quote");


/* =====================================================
   WEATHER ELEMENTS
   ===================================================== */

const weatherForm =
    document.querySelector("#weather-form");

const cityInput =
    document.querySelector("#city-input");

const weatherResult =
    document.querySelector("#weather-result");

const weatherCity =
    document.querySelector("#weather-city");

const weatherTemperature =
    document.querySelector("#weather-temperature");

const weatherHumidity =
    document.querySelector("#weather-humidity");

const weatherWind =
    document.querySelector("#weather-wind");

const weatherCondition =
    document.querySelector("#weather-condition");

const hairTip =
    document.querySelector("#hair-tip");


/* =====================================================
   GET QUOTE
   ===================================================== */

async function getQuote() {

    if (!quoteText || !quoteAuthor) {
        return;
    }

    quoteText.textContent =
        "Loading your inspiration...";

    quoteAuthor.textContent = "";

    try {

        const response =
            await fetch(QUOTE_API);

        if (!response.ok) {
            throw new Error(
                `Quote API error: ${response.status}`
            );
        }

        const data =
            await response.json();

        quoteText.textContent =
            `"${data.content}"`;

        quoteAuthor.textContent =
            `— ${data.author}`;

    } catch (error) {

        console.error(
            "Unable to load quote:",
            error
        );

        quoteText.textContent =
            "Take time to care for yourself and your hair.";

        quoteAuthor.textContent =
            "Nurtured by Mel";

    }
}


/* =====================================================
   WEATHER CODE
   ===================================================== */

function getWeatherDescription(code) {

    const weatherCodes = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Foggy",

        48: "Foggy",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Heavy drizzle",

        61: "Light rain",

        63: "Moderate rain",

        65: "Heavy rain",

        71: "Light snow",

        73: "Moderate snow",

        75: "Heavy snow",

        80: "Light rain showers",

        81: "Moderate rain showers",

        82: "Heavy rain showers",

        95: "Thunderstorm"

    };

    return weatherCodes[code] ||
        "Mixed weather conditions";
}


/* =====================================================
   HAIR-CARE WEATHER TIP
   ===================================================== */

function getHairTip(humidity) {

    if (humidity >= 70) {

        return "High humidity today. Consider a lightweight anti-frizz product and keep your hair moisturized.";

    }

    if (humidity >= 50) {

        return "Moderate humidity today. A balanced moisturizing routine can help keep your hair comfortable.";

    }

    return "The air is relatively dry today. Consider adding extra moisture to your hair-care routine.";

}


/* =====================================================
   FIND CITY
   ===================================================== */

async function findCity(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Location search failed: ${response.status}`
        );

    }

    const data =
        await response.json();

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            "City not found."
        );

    }

    return data.results[0];

}


/* =====================================================
   GET WEATHER
   ===================================================== */

async function getWeather(city) {

    if (!weatherResult) {
        return;
    }

    weatherResult.hidden = false;

    weatherResult.innerHTML =
        "<p>Loading weather information...</p>";

    try {

        const location =
            await findCity(city);

        const url =
            `${WEATHER_API}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Weather API error: ${response.status}`
            );

        }

        const data =
            await response.json();

        const current =
            data.current;


        if (weatherCity) {

            weatherCity.textContent =
                `${location.name}, ${location.country}`;

        }


        if (weatherTemperature) {

            weatherTemperature.textContent =
                `${Math.round(current.temperature_2m)}°C`;

        }


        if (weatherHumidity) {

            weatherHumidity.textContent =
                `${current.relative_humidity_2m}%`;

        }


        if (weatherWind) {

            weatherWind.textContent =
                `${Math.round(current.wind_speed_10m)} km/h`;

        }


        if (weatherCondition) {

            weatherCondition.textContent =
                getWeatherDescription(
                    current.weather_code
                );

        }


        if (hairTip) {

            hairTip.textContent =
                getHairTip(
                    current.relative_humidity_2m
                );

        }

    } catch (error) {

        console.error(
            "Unable to load weather:",
            error
        );

        weatherResult.innerHTML = `
            <p>
                We couldn't find weather information
                for that location. Please try another city.
            </p>
        `;

    }

}


/* =====================================================
   WEATHER FORM
   ===================================================== */

weatherForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const city =
            cityInput?.value.trim();

        if (!city) {
            return;
        }

        getWeather(city);

    }
);


/* =====================================================
   QUOTE BUTTON
   ===================================================== */

newQuoteButton?.addEventListener(
    "click",
    getQuote
);


/* =====================================================
   INITIALIZE
   ===================================================== */

getQuote();
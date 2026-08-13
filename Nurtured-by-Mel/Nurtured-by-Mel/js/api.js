/* =====================================================
   NURTURED BY MEL
   External API JavaScript Module
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
    document.querySelector("#quote");

const quoteAuthor =
    document.querySelector("#quote-author");

const newQuoteButton =
    document.querySelector("#new-quote");


/* =====================================================
   WEATHER ELEMENT
   ===================================================== */

const weatherCard =
    document.querySelector("#weather-card");


/* =====================================================
   GET QUOTE
   ===================================================== */

async function getQuote() {

    if (!quoteText) {
        return;
    }

    quoteText.textContent =
        "Loading your inspiration...";

    if (quoteAuthor) {
        quoteAuthor.textContent = "";
    }

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

        if (quoteAuthor) {
            quoteAuthor.textContent =
                `— ${data.author}`;
        }

    } catch (error) {

        console.error(
            "Unable to load quote:",
            error
        );

        quoteText.textContent =
            "Take time to care for yourself and your hair.";

        if (quoteAuthor) {
            quoteAuthor.textContent =
                "Nurtured by Mel";
        }
    }
}


/* =====================================================
   WEATHER DESCRIPTION
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

    return (
        weatherCodes[code] ||
        "Mixed weather conditions"
    );
}


/* =====================================================
   HAIR-CARE TIP
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

    if (!weatherCard) {
        return;
    }

    weatherCard.innerHTML = `
        <p>
            Loading today's weather...
        </p>
    `;

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

        const temperature =
            Math.round(
                current.temperature_2m
            );

        const humidity =
            current.relative_humidity_2m;

        const wind =
            Math.round(
                current.wind_speed_10m
            );

        const condition =
            getWeatherDescription(
                current.weather_code
            );

        const tip =
            getHairTip(humidity);


        weatherCard.innerHTML = `

            <div class="weather-content">

                <div class="weather-main">

                    <p class="weather-location">
                        ${location.name},
                        ${location.country}
                    </p>

                    <p class="weather-temperature">
                        ${temperature}°C
                    </p>

                    <p class="weather-condition">
                        ${condition}
                    </p>

                </div>


                <div class="weather-details">

                    <div class="weather-detail">

                        <span
                            class="weather-detail-label"
                        >
                            Humidity
                        </span>

                        <strong>
                            ${humidity}%
                        </strong>

                    </div>


                    <div class="weather-detail">

                        <span
                            class="weather-detail-label"
                        >
                            Wind
                        </span>

                        <strong>
                            ${wind} km/h
                        </strong>

                    </div>

                </div>


                <div class="hair-weather-tip">

                    <p class="eyebrow">
                        Hair-care tip
                    </p>

                    <p>
                        ${tip}
                    </p>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Unable to load weather:",
            error
        );

        weatherCard.innerHTML = `

            <div class="weather-error">

                <h3>
                    Weather unavailable
                </h3>

                <p>
                    We couldn't load today's weather.
                    Please try again later.
                </p>

            </div>

        `;
    }
}


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

/*
   Johannesburg, South Africa
   Approximate coordinates:
   Latitude: -26.2041
   Longitude: 28.0473
*/

getWeather("Johannesburg");
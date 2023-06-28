import React, { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

interface WeatherData {
    name: string;
    wind:{speed:string};
    weather: { description: string}[];
    main: { temp: number; pressure: number,temp_min:number,temp_max:number,humidity:number };
    visibility: number;
    sys: { sunrise: number; sunset: number,country:string };
    dateTime:{formattedDate:string,formattedTime:string};

}
function TimeAndDate(){
    // Get the current date and time
    var currentDate = new Date();

// Extract the hours and minutes
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

// Determine if it's AM or PM
    var amOrPm = hours >= 12 ? 'pm' : 'am';

// Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

// Format the time in "hh.mm" format
    var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + amOrPm;

// Extract the month and day
    var month = currentDate.toLocaleString('default', { month: 'short' });
    var day = currentDate.getDate();

// Format the date in "Month day" format
    var formattedDate = month + ' ' + day;

// Combine the formatted time and date
    var output = formattedTime + ', ' + formattedDate;


    // Return the formatted date and time
    return { formattedDate, formattedTime };
}


function WeatherInformation() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [isCacheExpired, setCacheExpired] = useState<boolean>(true);



    const fetchData = () => {
        const cityCodes = ["1248991", "1850147", "2644210", "2147714", "4930956"];
        const API_KEY = "fd0bcf24c4346f7a571e7b738801c03f";
        const url = `https://api.openweathermap.org/data/2.5/group?id=${cityCodes.join(
            ","
        )}&units=metric&appid=${API_KEY}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.list);

                // Get the formatted date and time
                const { formattedDate, formattedTime } = TimeAndDate();
                const updatedWeatherData = data.list.map((item: WeatherData) => ({
                    ...item,
                    dateTime: { formattedDate, formattedTime },
                }));

                // Store data in cache with timestamp
                const cacheData = {
                    timestamp: new Date().getTime(),
                    data: updatedWeatherData,

                };
                localStorage.setItem("weatherData", JSON.stringify(cacheData));
                // Update the weatherData state with the dateTime values

                setWeatherData(updatedWeatherData);
                setCacheExpired(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleButtonClick = () => {
        const cachedData = localStorage.getItem("weatherData");
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (
                parsedData.timestamp &&
                new Date().getTime() - parsedData.timestamp < 3 * 60 * 1000
            ) {
                setWeatherData(parsedData.data);
                //setWeatherData(parsedData.dateTime)
                setCacheExpired(false);
                return;
            }
        }

        // Fetch new data
        fetchData();
    };

    useEffect(() => {
        // Check if cached data exists and if cache is expired
        const cachedData = localStorage.getItem("weatherData");
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (
                parsedData.timestamp &&
                new Date().getTime() - parsedData.timestamp < 3 * 60 * 1000
            ) {
                setWeatherData(parsedData.data);
               //setWeatherData(parsedData.dateTime)
                setCacheExpired(false);
                return;
            }
        }

        // Fetch new data
        fetchData();
    }, []);

    return (
        <>
            <Button variant="outline-dark" onClick={handleButtonClick} className="button">Refresh</Button>{' '}
            {weatherData.map((weather, index) => (
                <WeatherInfo key={index} weather={weather}/>
            ))}

        </>
    );

}


function WeatherInfo({ weather }: { weather: WeatherData }) {
    const {
        weather: weatherDescription,
        sys: { sunrise, sunset },
    } = weather;



    let className = `col-6-${weather.name === "Colombo" ? 'color1' : weather.name === "Tokyo" ? 'color2' : weather.name === "Liverpool" ? 'color3' : weather.name === "Sydney" ? 'color4' : 'color5'}`;

    let weatherIcon: string; // Declare the weatherIcon variable

    // Determine the weather icon based on the weather condition
    if (weatherDescription[0].description === 'overcast clouds') {
        weatherIcon = 'src/assets/cloudsOvercast.png';
    } else if (weatherDescription[0].description === 'broken clouds') {
        weatherIcon = 'src/assets/brokenClouds.png';
    } else if (weatherDescription[0].description === 'clear sky') {
        weatherIcon = 'src/assets/clear.png';
    } else if (weatherDescription[0].description === 'few clouds') {
        weatherIcon = 'src/assets/fewClouds.png';
    } else if (weatherDescription[0].description === 'light rain') {
        weatherIcon = 'src/assets/drizzle.png';
    }else if (weatherDescription[0].description === 'thunderstorm') {
        weatherIcon = 'src/assets/thunderstorm.png';
    }
    else if (weatherDescription[0].description === 'moderate rain') {
        weatherIcon = 'src/assets/moderateRain.png';
    }else if (weatherDescription[0].description === 'heavy intensity rain') {
        weatherIcon = 'src/assets/heavyRain1.png';}
    else {
        weatherIcon = 'src/assets/default.png'; // Default icon if no specific condition matches
    }
    // Convert sunrise UNIX timestamp to formatted time string
    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });

    // Convert sunset UNIX timestamp to formatted time string
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });


    return (
        <div>
                <div className="row gy-5">
                    <div className="col-6">
                    <div className={className}>
                        <div className="p-3">
                            <h2 className="city" style={{ fontWeight: 'bold' }}>{weather.name},{weather.sys.country}</h2>
                            <h1 id="datetime" style={{ fontWeight: 'bold' }}>{weather.dateTime.formattedDate}, {weather.dateTime.formattedTime}</h1>
                            <img src={weatherIcon} className="weather-icon"/>
                            <p className="description">{weatherDescription[0].description}</p>
                            <p className="temp">{weather.main.temp}°C</p>
                            <p className="tempMin">Temp Min:{" "+weather.main.temp_min}°C</p>
                            <p className="tempMax">Temp Max:{" "+weather.main.temp_max}°C</p>
                            <div className="details">
                                <div className="col1">
                                    <img src="src/assets/humidity.png"/>
                                    <div>
                                        <p className="humidity">{weather.main.humidity}%</p>
                                        <p><strong>Humidity</strong></p>
                                    </div>
                                </div>
                                <div className="col2">
                                    <div className="new">
                                        <img src="src/assets/wind.png"/>
                                    </div>
                                    <p className="wind"><strong>{weather.wind.speed}m/s</strong> WindSpeed</p></div>
                            </div>

                            <div className="footer1">
                                <div className="inner1">
                                    <p>Pressure: {weather.main.pressure}hPa</p>
                                    <p>Visibility: {weather.visibility / 1000}km</p>
                                </div>
                                <div className="inner2">
                                    <p style={{ color: 'white' }}>Sunrise: {sunriseTime}</p>
                                    <p style={{ color: 'white' }}>Sunset: {sunsetTime}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherInformation;

export  function BasicExample() {
    return (
        <div className="spinner">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>
    );
}
/*
export function SizesExample() {
    return (
        <div className="spinner">
            <Spinner animation="border" size="sm" />
            <Spinner animation="border" />
            <Spinner animation="grow" size="sm" />
            <Spinner animation="grow" />
        </div>
    );
}
*/




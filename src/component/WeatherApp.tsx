import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Thermometer, Wind, Droplets, Snowflake, Eye, Sunrise, Sunset, TrendingUp, TrendingDown, Waves } from 'lucide-react';
import { WeatherSVG } from '../utils/WeatherSVG';

const API_KEY = import.meta.env.VITE_API_KEY as string;
const CITY = import.meta.env.VITE_CITY as string;

interface WeatherData {
    name: string;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
        temp_min: number;
        temp_max: number;
        sea_level: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    visibility: number;
}

const WeatherComponent: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(CITY)}&appid=${API_KEY}&units=metric`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: WeatherData = await response.json();
                setWeather(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (weatherMain: string) => {
        switch (weatherMain) {
            case 'Clear':
                return <Sun className="w-12 h-12 text-yellow-400" />;
            case 'Clouds':
                return <Cloud className="w-12 h-12 text-gray-400" />;
            case 'Rain':
                return <CloudRain className="w-12 h-12 text-blue-400" />;
            case 'Snow':
                return <Snowflake className="w-12 h-12 text-white" />;
            default:
                return <Thermometer className="w-12 h-12 text-red-400" />;
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-IN', { 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
        });
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="max-w-5xl w-full p-6 bg-white bg-opacity-90 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                  <WeatherSVG />
              </div>
              <div className="w-full md:w-1/2 text-black">
                  <h1 className="text-3xl font-bold mb-4 text-center">{CITY} Weather</h1>
                        {loading && <p className="text-center text-lg animate-pulse">Loading weather data...</p>}
                        {error && <p className="text-center text-red-600 bg-white bg-opacity-75 p-4 rounded-lg">{error}</p>}
                        {weather && (
                            <div className="text-center">
                                <div className="flex justify-center mb-3">
                                    {getWeatherIcon(weather.weather[0].main)}
                                </div>
                                <h2 className="text-xl font-semibold mb-1">{weather.name}, {weather.sys.country}</h2>
                                <p className="text-4xl font-bold mb-3">{Math.round(weather.main.temp)}°C</p>
                                <p className="text-lg italic mb-3">{weather.weather[0].description}</p>

                                {/* Weather Metrics Grid */}
                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 text-sm">
                                    {/* Current Temperature */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Thermometer className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Temp</p>
                                        <p>{Math.round(weather.main.temp)}°C</p>
                                    </div>

                                    {/* Humidity */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Droplets className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Humidity</p>
                                        <p>{weather.main.humidity}%</p>
                                    </div>

                                    {/* Wind Speed */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Wind className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Wind</p>
                                        <p>{weather.wind.speed} m/s</p>
                                    </div>

                                    {/* Pressure */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Thermometer className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Pressure</p>
                                        <p>{weather.main.pressure} hPa</p> 
                                    </div>

                                    {/* Visibility */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Eye className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Visibility</p>
                                        <p>{(weather.visibility / 1000).toFixed(1)} km</p> 
                                    </div>

                                    {/* Sea Level */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Waves className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Sea Level</p>
                                        <p>{weather.main.sea_level} hPa</p>
                                    </div>

                                    {/* Temp Min */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <TrendingDown className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Low</p>
                                        <p>{Math.round(weather.main.temp_min)}°C</p>
                                    </div>

                                    {/* Temp Max */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <TrendingUp className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">High</p>
                                        <p>{Math.round(weather.main.temp_max)}°C</p>
                                    </div>

                                    {/* Sunrise */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Sunrise className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Sunrise</p>
                                        <p>{formatTime(weather.sys.sunrise)}</p>
                                    </div>

                                    {/* Sunset */}
                                    <div className="bg-white bg-opacity-30 p-2 rounded-lg flex flex-col items-center justify-center" style={{ height: '80px' }}>
                                        <Sunset className="w-5 h-5 mb-1" />
                                        <p className="font-semibold">Sunset</p>
                                        <p>{formatTime(weather.sys.sunset)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherComponent;

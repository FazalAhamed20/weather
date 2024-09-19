import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Thermometer, Wind, Droplets, Snowflake } from 'lucide-react';
import { WeatherSVG } from '../utils/WeatherSVG';

const API_KEY = import.meta.env.VITE_API_KEY as string;
const CITY = import.meta.env.VITE_CITY as string;

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
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
        return <Sun className="w-16 h-16 text-yellow-400 animate-spin-slow" />;
      case 'Clouds':
        return <Cloud className="w-16 h-16 text-gray-400 animate-bounce-slow" />;
      case 'Rain':
        return <CloudRain className="w-16 h-16 text-blue-400 animate-pulse" />;
      case 'Snow':
        return <Snowflake className="w-16 h-16 text-white animate-spin-slow" />;
      default:
        return <Thermometer className="w-16 h-16 text-red-400 animate-pulse" />;
    }
  };

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      <div className="max-w-4xl w-full p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <WeatherSVG />
          </div>
          <div className="w-full md:w-1/2 text-black">
            <h1 className="text-4xl font-bold mb-6 text-center">London Weather</h1>
            {loading && <p className="text-center text-xl animate-pulse">Loading weather data...</p>}
            {error && <p className="text-center text-red-600 bg-white bg-opacity-75 p-4 rounded-lg">{error}</p>}
            {weather && (
              <div className="text-center">
                <div className="flex justify-center mb-4 transition-all duration-300 ease-in-out transform hover:scale-110">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{weather.name}, {weather.sys.country}</h2>
                <p className="text-5xl font-bold mb-4 transition-all duration-300 ease-in-out transform hover:scale-110">{Math.round(weather.main.temp)}°C</p>
                <p className="text-xl mb-4 italic">{weather.weather[0].description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white bg-opacity-30 p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                    <Droplets className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-semibold">Humidity</p>
                    <p>{weather.main.humidity}%</p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                    <Wind className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-semibold">Wind Speed</p>
                    <p>{weather.wind.speed} m/s</p>
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
import React, { useState, useEffect } from 'react';
import {
    Sun, Cloud, CloudRain, Thermometer, Wind, Droplets, Snowflake, MapPin,  Users
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY as string;

interface WeatherData {
    name: string;
    sys: {
        country: string;
    };
    main: {
        temp: number;
        feels_like: number;
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

interface CountryData {
    name: {
        common: string;
    };
    capital: string[];
    population: number;
    flags: {
        svg: string;
    };
}

const WeatherComponent: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [country, setCountry] = useState<CountryData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (searchQuery) {
            fetchCountryAndWeather(searchQuery);
        }
    }, [searchQuery]);

    const fetchCountryAndWeather = async (countryName: string) => {
        setLoading(true);
        setError(null);
        try {
            // Fetch country data
            const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
            if (!countryResponse.ok) throw new Error('Country not found');
            const countryData = await countryResponse.json();
            setCountry(countryData[0]);

            // Fetch weather data for the capital
            const capital = countryData[0].capital[0];
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`);
            if (!weatherResponse.ok) throw new Error('Weather data not found');
            const weatherData = await weatherResponse.json();
            setWeather(weatherData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchCountryAndWeather(searchQuery);
        }
    };

    const getWeatherIcon = (weatherMain: string) => {
        switch (weatherMain) {
            case 'Clear': return <Sun className="w-16 h-16 text-yellow-400" />;
            case 'Clouds': return <Cloud className="w-16 h-16 text-gray-400" />;
            case 'Rain': return <CloudRain className="w-16 h-16 text-blue-400" />;
            case 'Snow': return <Snowflake className="w-16 h-16 text-blue-200" />;
            default: return <Thermometer className="w-16 h-16 text-red-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Global Weather Explorer</h1>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter a country name"
                            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition duration-300">
                            Search
                        </button>
                    </div>
                </form>

                {loading && <p className="text-center text-gray-600 animate-pulse">Exploring the globe for you...</p>}
                {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

                {country && weather && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="country-info bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center mb-4">
                                <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-12 h-8 mr-3" />
                                <h2 className="text-2xl font-semibold text-gray-800">{country.name.common}</h2>
                            </div>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> Capital: {country.capital[0]}</p>
                                <p className="flex items-center"><Users className="w-5 h-5 mr-2" /> Population: {country.population.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="weather-info bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Weather in {weather.name}</h3>
                                {getWeatherIcon(weather.weather[0].main)}
                            </div>
                            <div className="space-y-2 text-gray-600">
                                <p className="text-4xl font-bold text-gray-800 mb-2">{Math.round(weather.main.temp)}°C</p>
                                <p className="italic">{weather.weather[0].description}</p>
                                <p className="flex items-center"><Thermometer className="w-5 h-5 mr-2" /> Feels like: {Math.round(weather.main.feels_like)}°C</p>
                                <p className="flex items-center"><Droplets className="w-5 h-5 mr-2" /> Humidity: {weather.main.humidity}%</p>
                                <p className="flex items-center"><Wind className="w-5 h-5 mr-2" /> Wind: {weather.wind.speed} m/s</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherComponent;
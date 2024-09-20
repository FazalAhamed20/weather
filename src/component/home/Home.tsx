import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import WeatherComponent from '../WeatherApp';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Droplets, Thermometer, MapPin, Bell,  ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Make sure to import the CSS for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_KEY = import.meta.env.VITE_API_KEY as string;

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: Array<{ main: string; description: string }>;
  wind: { speed: number };
}

const HomePage: React.FC = () => {
  const [randomWeather, setRandomWeather] = useState<WeatherData[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('New York');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const countries = ['Tokyo', 'London', 'Paris', 'New York', 'Sydney'];
    const fetchRandomWeather = async () => {
      const weatherPromises = countries.map(async (country) => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${API_KEY}&units=metric`);
        return response.json();
      });
      const weatherData = await Promise.all(weatherPromises);
      setRandomWeather(weatherData);
    };
    fetchRandomWeather();

    const fetchForecast = async () => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setForecast(data.list.filter((_: any, index: number) => index % 8 === 0));
    };
    fetchForecast();
  }, [selectedCity]);

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain) {
      case 'Clear': return <Sun className="w-10 h-10 text-yellow-400" />;
      case 'Clouds': return <Cloud className="w-10 h-10 text-gray-400" />;
      case 'Rain': return <CloudRain className="w-10 h-10 text-blue-400" />;
      case 'Snow': return <Snowflake className="w-10 h-10 text-blue-200" />;
      default: return <Sun className="w-10 h-10 text-yellow-400" />;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col">
    <header className="bg-indigo-800 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sun className="h-8 w-8 text-yellow-400 mr-2" />
            <h1 className="text-2xl font-bold">Global Weather App</h1>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-md transition duration-300"
            >
              <MapPin size={18} />
              <span>{selectedCity}</span>
              <ChevronDown size={18} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                >
                  {['New York', 'London', 'Tokyo', 'Sydney', 'Paris'].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100 transition duration-300"
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <motion.section 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-indigo-800">Welcome to Your Global Weather Hub</h2>
          <p className="text-xl text-gray-700">
            Explore real-time weather conditions and forecasts from around the world.
          </p>
        </motion.section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Global Weather Snapshot</h2>
          <Slider {...settings}>
            {randomWeather.map((weather, index) => (
              <div key={index} className="px-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{weather.name}</h3>
                    {getWeatherIcon(weather.weather[0].main)}
                  </div>
                  <p className="text-3xl font-bold text-indigo-600 mb-2">{Math.round(weather.main.temp)}°C</p>
                  <p className="text-gray-600 capitalize">{weather.weather[0].description}</p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Current Weather</h2>
          <WeatherComponent />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">5-Day Forecast for {selectedCity}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-lg"
              >
                <p className="text-lg font-semibold mb-2">{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                {getWeatherIcon(day.weather[0].main)}
                <p className="text-2xl font-bold mt-2">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm text-gray-600 capitalize">{day.weather[0].description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Weather Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <Thermometer className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Temperature Trends</h3>
              <p className="text-gray-700">Analyze global temperature patterns and their impact on climate.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <Droplets className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Humidity Levels</h3>
              <p className="text-gray-700">Explore how humidity affects comfort and weather conditions.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <Wind className="w-12 h-12 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Wind Patterns</h3>
              <p className="text-gray-700">Discover the influence of wind on local and global weather systems.</p>
            </motion.div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Interactive Weather Map</h2>
          <div className="bg-white p-4 rounded-xl shadow-lg overflow-hidden">
            <svg
              viewBox="0 0 800 400"
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            >
              <defs>
                <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4299e1" />
                  <stop offset="100%" stopColor="#3182ce" />
                </linearGradient>
                <radialGradient id="sun" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#faf089" />
                  <stop offset="100%" stopColor="#ecc94b" />
                </radialGradient>
                <filter id="cloud-shadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
                </filter>
              </defs>

              <rect width="800" height="400" fill="url(#ocean)" />
              
              <circle cx="700" cy="80" r="40" fill="url(#sun)">
                <animate attributeName="cy" values="80;60;80" dur="4s" repeatCount="indefinite" />
              </circle>

              <g filter="url(#cloud-shadow)">
                <path d="M100,100 Q130,80 160,100 T220,100 Q250,80 280,100 T340,100 Q310,130 280,130 H160 Q130,130 100,100 Z" fill="white">
                  <animateTransform attributeName="transform" type="translate" values="0 0; 50 0; 0 0" dur="7s" repeatCount="indefinite" />
                </path>
              </g>

              <g filter="url(#cloud-shadow)">
                <path d="M500,150 Q530,130 560,150 T620,150 Q650,130 680,150 T740,150 Q710,180 680,180 H560 Q530,180 500,150 Z" fill="white">
                  <animateTransform attributeName="transform" type="translate" values="0 0; -100 0; 0 0" dur="9s" repeatCount="indefinite" />
                </path>
              </g>

              <path d="M0,300 Q200,250 400,300 T800,300 V400 H0 Z" fill="#48bb78" />
              
              <g>
                <path d="M350,320 L400,220 L450,320 Z" fill="#2d3748" />
                <rect x="390" y="320" width="20" height="40" fill="#2d3748" />
              </g>

              <g>
                <circle cx="180" cy="350" r="6" fill="#2d3748" />
                <circle cx="200" cy="350" r="6" fill="#2d3748" />
                <circle cx="220" cy="350" r="6" fill="#2d3748" />
              </g>

              <g>
                <circle cx="600" cy="330" r="8" fill="#2d3748" />
                <circle cx="624" cy="330" r="8" fill="#2d3748" />
                <circle cx="648" cy="330" r="8" fill="#2d3748" />
              </g>
            </svg>
            <p className="text-center mt-4 text-gray-700">Explore animated weather patterns across our stylized global map.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Weather Alerts</h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start space-x-4"
          >
            <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
            <p className="font-bold">Severe Weather Alert:</p>
              <p>Heavy thunderstorms expected in the {selectedCity} area tonight. Stay indoors and stay safe!</p>
            </div>
          </motion.div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Weather Trivia</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Did you know?</h3>
            <p className="text-gray-700">The fastest wind speed ever recorded was 253 mph (407 km/h) during Tropical Cyclone Olivia on Barrow Island, Australia, in 1996.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-700">Get in Touch</h2>
          <form className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="your@email.com" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="bg-indigo-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm">Global Weather App provides real-time weather updates and forecasts worldwide, helping you stay prepared wherever you are.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-indigo-300 transition duration-300">Home</a></li>
                <li><a href="#" className="text-sm hover:text-indigo-300 transition duration-300">Forecast</a></li>
                <li><a href="#" className="text-sm hover:text-indigo-300 transition duration-300">Weather Map</a></li>
                <li><a href="#" className="text-sm hover:text-indigo-300 transition duration-300">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-indigo-300 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-white hover:text-indigo-300 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-white hover:text-indigo-300 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-700 text-center">
            <p>&copy; {new Date().getFullYear()} Global Weather App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import Main from './components/Main';
import WeatherBackground from './components/WeatherBackground';
import axios from 'axios';
const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [unit, setUnit] = useState('C');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const API_KEY = 'd4b37aa109f1e7b386992a50830e896f'; 

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchsuggestions(city), 500);
      return () => clearTimeout(timer);
    }
    setSuggestion([]);
  }, [city, weather]);

  const fetchsuggestions = async (query) => {
    try {
      setIsSearching(true);
      const res=  await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?`,
        {
          params:{
            q: query,
            limit: 5,
            appid: API_KEY
          }
        }
      );
     setSuggestion(res.data);
    } catch {
      setSuggestion([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getWeatherCondition = () => weather && {
    main: weather.weather[0].main,
    isDay: Date.now() / 1000 > weather.sys.sunrise && Date.now() / 1000 < weather.sys.sunset
  };

  const convertTemperature = (temp, unit) => {
    if (unit === 'F') return (temp * 9/5) + 32;
    return temp;
  };
//axios
  const fetchWeatherData = async (url, cityLabel) => {
  try {
    setIsSearching(true);
    const { data } = await axios.get(url);
    setWeather(data);
    setCity(cityLabel || '');
    setSuggestion([]);
    setError('');
  } catch (error) {
    console.error('Weather fetch error:', error);
    setWeather(null);
    setError(error.response?.data?.message || 'Failed to fetch weather data');
  } finally {
    setIsSearching(false);
  }
};

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city || city.length < 3) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    await fetchWeatherData(url, city);
  };

  const getWeatherEmoji = (condition) => {
    switch(condition) {
      case 'Clear': return '☀️';
      case 'Clouds': return '☁️';
      case 'Rain': return '🌧️';
      case 'Drizzle': return '🌦️';
      case 'Thunderstorm': return '⛈️';
      case 'Snow': return '❄️';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog': return '🌫️';
      default: return '🌈';
    }
  };

  return (
    <div className='app'>
      <WeatherBackground condition={getWeatherCondition()} />

      <div className='flex items-center justify-center min-h-screen p-6'>
        <div className='bg-white/10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-md text-white w-full border border-white/30 relative z-10'>
          <h1 className='text-4xl font-extrabold text-center mb-6'>
            <Main />
          </h1>
          
          {!weather ? (
            <form onSubmit={handleSearch} className='flex flex-col relative'>
              <div className="relative mb-4">
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder='🌍 Enter city or country...'
                  className='w-full p-4 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 shadow-lg'
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              
              {suggestion.length > 0 && (
                <div className='absolute top-20 left-0 right-0 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg z-10 overflow-hidden border border-white/20'>
                  {suggestion.map((s) => (
                    <button 
                      type='button' 
                      key={`${s.lat}-${s.lon}`}
                      onClick={() => fetchWeatherData(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                        `${s.name},${s.country}${s.state ? `, ${s.state}` : ''}`
                      )}
                      className='block w-full text-left px-4 py-3 hover:bg-white/20 transition-colors duration-200 border-b border-white/10 last:border-0 flex items-center'
                    >
                      <span className="mr-2">📍</span>
                      <span>
                        {s.name}, {s.country}{s.state && `, ${s.state}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                type='submit' 
                disabled={city.length < 3 || isSearching}
                className={`bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center ${city.length < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSearching ? (
                  <>
                    <span className="mr-2">⏳</span> Searching...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔍</span> Get Weather
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className='mt-6 text-center transition-opacity duration-500'>
              <button 
                onClick={() => { setWeather(null); setCity(''); }}
                className='mb-6 bg-gradient-to-r from-purple-800 to-blue-700 hover:from-purple-900 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 flex items-center mx-auto'
              >
                <span className="mr-2">🔄</span> New Search
              </button>

              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-3xl font-bold flex items-center'>
                  <span className="mr-2">🏙️</span> {weather.name}
                </h2>
                <button 
                  onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
                  className='bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow transform hover:scale-105 active:scale-95'
                >
                  {unit === 'C' ? '°C → °F' : '°F → °C'}
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description} 
                  className='mx-auto my-2 w-20 h-20'
                />
                <p className='text-5xl font-bold mb-2'>
                  {convertTemperature(weather.main.temp, unit).toFixed(1)}°{unit}
                </p>
                <p className='capitalize text-xl flex items-center justify-center'>
                  <span className="mr-2">{getWeatherEmoji(weather.weather[0].main)}</span>
                  {weather.weather[0].description}
                </p>
              </div>
              
              <div className='grid grid-cols-3 gap-4 mb-6'>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20'>
                  <p className='font-semibold flex items-center justify-center'>💧 Humidity</p>
                  <p className='text-xl font-bold'>{weather.main.humidity}%</p>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20'>
                  <p className='font-semibold flex items-center justify-center'>🌬️ Wind</p>
                  <p className='text-xl font-bold'>{weather.wind.speed} m/s</p>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20'>
                  <p className='font-semibold flex items-center justify-center'>👀 Visibility</p>
                  <p className='text-xl font-bold'>{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                  <p className='font-semibold flex items-center justify-center'>🌅 Sunrise</p>
                  <p className='text-lg'>
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                  <p className='font-semibold flex items-center justify-center'>🌇 Sunset</p>
                  <p className='text-lg'>
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20'>
                <p className='mb-2'><span className="font-semibold">🌡️ Feels like:</span> {convertTemperature(weather.main.feels_like, unit).toFixed(1)}°{unit}</p>
                <p><span className="font-semibold">⚖️ Pressure:</span> {weather.main.pressure} hPa</p>
              </div>
            </div>
          )}

          {error && (
            <div className='mt-4 p-3 bg-red-400/20 backdrop-blur-sm rounded-xl border border-red-400/30 text-red-100 text-center'>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
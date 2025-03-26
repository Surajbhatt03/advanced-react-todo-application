import axios from 'axios';

// Using environment variable for API key
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const getWeatherData = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    );
    
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error('Failed to fetch weather data');
  }
};

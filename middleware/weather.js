// utils/weather.js
const axios = require('axios');

async function fetchWeather(req, res, next) {
    if (!req.session.user || !req.session.user.location) {
      return next();
    }
  
    try {
      console.log('Session user:', req.session.user); 
      const userLocation = req.session.user.location || 'San Jose';
      console.log('📍 Using location:', userLocation); 
  
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(userLocation)}&appid=${apiKey}&units=imperial`;
  
      const response = await axios.get(url);
      const data = response.data;
  
      res.locals.weather = {
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      };
    } catch (error) {
      console.error('Weather fetch failed:', error.message);
      res.locals.weather = null;
    }
  
    next();
  }
  


module.exports = fetchWeather;

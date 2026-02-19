import { useState, useEffect } from 'react'

export default function WeatherWidget({ visible }) {
  const [weather, setWeather] = useState({
    temp: '--',
    location: 'Loading...',
    condition: 'Initializing',
    icon: '⏳'
  })

  useEffect(() => {
    const defaultCoords = { lat: 28.6139, lon: 77.2090, city: 'New Delhi' }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        () => {
          // Fallback if permission denied
          fetchWeatherData(defaultCoords.lat, defaultCoords.lon, defaultCoords.city)
        }
      )
    } else {
      fetchWeatherData(defaultCoords.lat, defaultCoords.lon, defaultCoords.city)
    }
  }, [])

  const fetchWeatherData = async (lat, lon, forcedCity = null) => {
    try {
      // 1. Fetch Weather Data from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
      )
      const weatherData = await weatherRes.json()
      const current = weatherData.current_weather

      // 2. Fetch City Name from Nominatim (Reverse Geocoding)
      let cityName = forcedCity
      if (!cityName) {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        )
        const geoData = await geoRes.json()
        cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || 'Unknown Location'
      }

      setWeather({
        temp: Math.round(current.temperature) + '°C',
        location: cityName,
        condition: getWeatherDescription(current.weathercode),
        icon: getWeatherIcon(current.weathercode)
      })
    } catch (err) {
      console.error('Weather Fetch Error:', err)
      setWeather(prev => ({ ...prev, condition: 'Update Failed', icon: '⚠️' }))
    }
  }

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️'
    if (code <= 3) return '🌤️'
    if (code <= 48) return '🌫️'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '❄️'
    if (code <= 82) return '🌧️'
    if (code <= 86) return '❄️'
    if (code <= 99) return '⚡'
    return '☀️'
  }

  const getWeatherDescription = (code) => {
    if (code === 0) return 'Clear Sky'
    if (code <= 3) return 'Partly Cloudy'
    if (code <= 48) return 'Foggy'
    if (code <= 67) return 'Rainy'
    if (code <= 77) return 'Snowy'
    if (code <= 99) return 'Stormy'
    return 'Clear'
  }

  return (
    <div className={`weather-widget${visible ? ' show' : ''}`}>
      <div className="weather-icon">{weather.icon}</div>
      <div className="weather-info">
        <h4>{weather.temp}</h4>
        <p>{weather.location}, {weather.condition}</p>
      </div>
    </div>
  )
}

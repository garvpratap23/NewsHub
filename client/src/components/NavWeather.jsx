import { useState, useEffect } from 'react'

export default function NavWeather() {
  const [weather, setWeather] = useState({
    temp: '--',
    location: '',
    icon: '⏳'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const defaultCoords = { lat: 28.6139, lon: 77.2090, city: 'Delhi' }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude)
        },
        () => {
          fetchWeatherData(defaultCoords.lat, defaultCoords.lon, defaultCoords.city)
        }
      )
    } else {
      fetchWeatherData(defaultCoords.lat, defaultCoords.lon, defaultCoords.city)
    }
  }, [])

  const fetchWeatherData = async (lat, lon, forcedCity = null) => {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
      )
      const weatherData = await weatherRes.json()
      const current = weatherData.current_weather

      let cityName = forcedCity
      if (!cityName) {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
        )
        const geoData = await geoRes.json()
        cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || 'Unknown'
      }

      setWeather({
        temp: Math.round(current.temperature) + '°',
        location: cityName,
        icon: getWeatherIcon(current.weathercode)
      })
      setLoading(false)
    } catch (err) {
      console.error('Weather Fetch Error:', err)
      setWeather(prev => ({ ...prev, icon: '⚠️' }))
      setLoading(false)
    }
  }

  const getWeatherIcon = (code) => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return '☀️' // Clear sky
    if (code === 1) return '🌤️' // Mainly clear
    if (code === 2) return '⛅' // Partly cloudy
    if (code === 3) return '☁️' // Overcast
    if (code <= 48) return '🌫️' // Fog
    if (code <= 55) return '🌦️' // Drizzle
    if (code <= 67) return '🌧️' // Rain
    if (code <= 77) return '❄️' // Snow
    if (code <= 82) return '🌧️' // Rain showers
    if (code <= 86) return '❄️' // Snow showers
    if (code <= 99) return '⚡' // Thunderstorm
    return '☀️'
  }

  if (loading) return null

  return (
    <div className="nav-weather" title={`${weather.location}: ${weather.temp}`}>
      <span className="nav-weather-icon">{weather.icon}</span>
      <span className="nav-weather-location">{weather.location}</span>
      <span className="nav-weather-temp">{weather.temp}</span>
    </div>
  )
}

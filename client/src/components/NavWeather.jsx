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

  if (loading) return null

  return (
    <div className="nav-weather" title={weather.location}>
      <span className="nav-weather-icon">{weather.icon}</span>
      <span className="nav-weather-temp">{weather.temp}</span>
    </div>
  )
}

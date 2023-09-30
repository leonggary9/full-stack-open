import { useState, useEffect } from "react"
import weatherService from "../services/weather"

const Weather = ({country}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService
        .getWeatherByCity(country.capital)
        .then(data => {
            setWeather(data)
        })
    }, [])

    if (weather == null) {
        return
    }

    return (
        <>
            <h2>Weather in {country.capital}</h2>
            <p>temperature: {(weather.main.temp-273.15).toFixed(2)} Celsius</p>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <p>wind: {weather.wind.speed} m/s</p>
        </>
    )
}

export default Weather
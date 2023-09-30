import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.OPENWEATHER_API_KEY

const getWeatherByCity = (city) => {
    return axios
        .get(`${baseUrl}?q=${city}&appid=${apiKey}`)
        .then(response => {
            console.log('weather data', response.data)
            return response.data
        })
}

export default {getWeatherByCity}
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    return axios
        .get(`${baseUrl}/all`)
        .then(response => {
            return response.data
        })
}

const getCountryByName = (countryName) => {
    return axios
        .get(`${baseUrl}/name/${countryName}`)
        .then(response => {
            response.data
        })
}

export default {getAll, getCountryByName}
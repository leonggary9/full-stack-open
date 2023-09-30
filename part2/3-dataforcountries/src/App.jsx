import { useEffect, useState } from 'react'

import Countries from './components/Countries'
import Filter from './components/Filter'
import countryService from './services/country'

function App() {
  const [countries, setCountries] = useState(null)
  const [filterBy, setFilterBy] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(allCountriesData => {
        console.log(`retrieved all ${allCountriesData.length} countries data`)
        setCountries(allCountriesData)
      })
  }, [])

  if (!countries) {
    return null
  }

  const handleFilterByChange = (event) => {
    setFilterBy(event.target.value)
    setFilteredCountries(filterBy === '' ? countries : countries.filter(c => c.name.common.toLowerCase().indexOf(filterBy.toLowerCase()) > -1))
  }

  const showCountry = (country) => {
    setFilteredCountries([country])
  }

  return (
    <div>
      <Filter text={filterBy} handleInput={handleFilterByChange} />
      <Countries countries={filteredCountries} showCountry={showCountry}/>
    </div>
  )
}

export default App

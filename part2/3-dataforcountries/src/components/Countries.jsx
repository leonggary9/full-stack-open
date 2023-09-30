import Weather from "./Weather"

const Countries = ({countries, showCountry}) => {
    if (countries === null) {
        return null
    }
    console.log(`rendering ${countries.length} countries`)
    if (countries.length === 0) {
        return <p>No such country found with filter</p>
    }
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }
    if (countries.length === 1) {
        const country = countries[0]
        const languages = Object.keys(country.languages).map(val => country.languages[val])
        const flagLink = country.flags.png
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p> capital: {country.capital} </p>
                <p> area: {country.area} </p>
                <p><strong>languages:</strong></p>
                <ul>
                    {
                        languages.map(l => <li key={l}>{l}</li>)
                    }
                </ul>
                <img src={flagLink}></img>
                <Weather country={country} />
            </div>
        )
    }
    return (
        <ul>
            {
                countries.map(c => 
                    <li key={c.name.common}>
                        {c.name.common}    <button onClick={() => showCountry(c)}>show</button>
                    </li>)
            }
        </ul>
    )
} 

export default Countries
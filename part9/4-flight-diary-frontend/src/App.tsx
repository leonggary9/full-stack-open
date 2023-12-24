import { useState, useEffect } from 'react'
import { DiaryEntry, Visibility, Weather } from './types'
import DiaryService from './services/diaryService'

function App() {
  const defaultVisibility = Visibility.Great;
  const defaultWeather = Weather.Sunny

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<Visibility>(defaultVisibility);
  const [weather, setWeather] = useState<Weather>(defaultWeather);
  const [comment, setComment] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    DiaryService.getAllEntries().then(
      d => {setDiaryEntries(d)}
    )
  }, [])

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const diaryToAdd = {
      date,
      visibility,
      weather,
      comment
    }
    console.log(diaryToAdd)
    DiaryService.createEntry(diaryToAdd).then(d => {
      setDiaryEntries(diaryEntries.concat(d))
      setDate('')
      setVisibility(defaultVisibility)
      setWeather(defaultWeather)
      setComment('')
    }).catch(error => {
      console.log(error)
      setErrorMessage(error.response.data)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    })
  }

  return (
    <div>
      <h2>Add New Entry</h2>
      <div style={{color: 'red'}}>{errorMessage}</div>
      <form onSubmit={diaryCreation}>
        <strong>date:</strong> <input type='date' value={date} onChange={e => setDate(e.target.value)} /><br/>
        <strong>visibility:</strong> <div>{
          Object.values(Visibility).map(v => 
            <div key={v.toString()}>
              <input type="radio" name="visibility" checked={visibility===v} onChange={() => setVisibility(v)} />
              {v.toString()} 
            </div>
          )
        }
        </div>
        <strong>weather:</strong> <div>{
          Object.values(Weather).map(w => 
            <div key={w.toString()}>
              <input type="radio" name="weather" checked={weather === w} onChange={() => setWeather(w)} />
              {w.toString()} 
            </div>
          )
        }
        </div>
        <strong>comment:</strong> <input value={comment} onChange={e => setComment(e.target.value)} /><br/>
        <button type='submit'>add</button>
      </form>
      <h2>Diary Entries</h2>
      {diaryEntries.map(d => 
        <div key={d.id}>
          <strong>{d.date}</strong>
          <p>
            visibility: {d.visibility} <br/>
            weather: {d.weather}
          </p>
        </div>
      )}
    </div>
  )
}

export default App

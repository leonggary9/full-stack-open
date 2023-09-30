import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './service/person'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import ErrorBanner from './components/ErrorBanner'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterBy, setFilterBy] = useState('')
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    console.log('retrieving persons')
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
      .catch(error => {
        setErrorMsg(`failed to retrieve all persons`)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log('current name input value is', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('current number input value is', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterByChange = (event) => {
    console.log('current filterBy input value is', event.target.value)
    setFilterBy(event.target.value)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.every((person) => (
      person.name !== newName
    ))) {
      let newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then(newPersonData => {
          console.log('adding new person', newPerson)
          setPersons(persons.concat(newPersonData))
          console.log('resetting newName and newNumber to empty')
          setNotificationMsg(`Added ${newName}`)
          setTimeout(() => {
            setNotificationMsg(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMsg(`failed to add ${newName}`)
          setTimeout(() => {
            setErrorMsg(null)
          }, 5000)
        })
    } else {
      const originalPerson = persons.find(p => p.name === newName)
      if (originalPerson.number === newNumber) {
        setErrorMsg(`${newName} with number ${newNumber} already exists`)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
        return
      }
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one (${newNumber})?`)) {
        let updatedPerson = {
          ...originalPerson,
          number: newNumber
        }
        console.log('updating person to', updatedPerson)
        personService
          .updatePerson(updatedPerson)
          .then(updatedPersonData => {
            setPersons(persons.map(p => p.id !== updatedPersonData.id ? p : updatedPersonData))
            setNotificationMsg(`Updated ${newName}`)
            setTimeout(() => {
              setNotificationMsg(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })  
      }
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      console.log(`deleting person ${person.id}`)
      personService
      .deletePersonById(person.id)
      .then(deletedData => {
        setNotificationMsg(`Deleted ${person.name}`)
        setTimeout(() => {
          setNotificationMsg(null)
        }, 5000)
        const updatedPersonsList = persons.filter(p => p.id !== person.id)
        setPersons(updatedPersonsList)
      })
      .catch(error => {
        setErrorMsg(`${person.name} was already deleted from the server`)
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
        const updatedPersonsList = persons.filter(p => p.id !== person.id)
        setPersons(updatedPersonsList)
      })
    }
  }

  // do not render anything if persons is still null
  if (!persons) {
    return null
  }

  const filteredPersons = filterBy === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filterBy.toLowerCase()))
  console.log(`rendering ${filteredPersons.length} persons`)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} />
      <ErrorBanner message={errorMsg} />

      <Filter text={filterBy} handleInput={handleFilterByChange} />

      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNewPerson={addNewPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
// app.use(express.static('dist'))

const customMorganFormat = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})
app.use(customMorganFormat)

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456'
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523'
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345'
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122'
//   }
// ]

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(allPersons => {
      console.log('retrieved all persons', allPersons)
      response.json(allPersons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(allPersons => {
      const date = new Date()
      response.send(
        `<div>
                <p>Phonebook has info for ${allPersons.length} people</p>
                <p>${date}</p>
            </div>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //   console.log('getting person', person)
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  Person.findById(request.params.id)
    .then(p => {
      if (p) {
        console.log('retrieved person', p)
        response.json(p)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(`deleted id ${request.params.id}`)
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(p => p.id))
//     : 0
//   return maxId + 1
// }

app.post('/api/persons', (request, response, next) => {
  console.log('post request received with body', request.body)
  const body = request.body
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'name and number must be specified'
  //   })
  // }
  // if (persons.map(person => person.name).includes(body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save()
    .then(savedPerson => {
      console.log(`created new person ${savedPerson}`)
      response.json(savedPerson)
    })
    .catch(error => next(error))
}

  // console.log('adding new person', newPerson)
  // persons = persons.concat(newPerson)
  // response.json(newPerson)
)

app.put('/api/persons/:id', (request, response, next) => {
  // const body = request.body
  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'name and number must be specified'
  //   })
  // }
  const { name, number } = request.body
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      console.log(`updated ${updatedPerson}`)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Unknown Endpoint Handler
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Error Handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

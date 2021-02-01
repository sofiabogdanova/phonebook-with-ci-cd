require('dotenv').config()
const express = require('express')
const handlers = require('./handlers')
const morgan = require('morgan')
const Person = require('./models/person')
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    const body = JSON.stringify(req.body)
    return body
  }
})
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  const receivedDate = new Date()
  Person.find({})
    .then(result => {
      const infoMessage = `Phonebook has info for ${result.length} people \n \n ${receivedDate}`
      response.send(infoMessage)
    })
})

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use(handlers.unknownEndpoint)

app.use(handlers.errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



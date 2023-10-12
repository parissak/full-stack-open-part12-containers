const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const configs = require('./config');

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.static('build'))

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.get('/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/persons/:id', (request, response, next) => {
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

app.get('/info', (request, response) => {
    const date = new Date().toUTCString()

    Person.countDocuments().then(count => {
        response.send(`<p> Phonebook has info for ${count} people <pp>
        <p> ${date} </p>`)
    })
})

app.delete('/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => { response.status(204).end() })
        .catch(error => next(error))
})

app.post('/persons', (request, response, next) => {
    if (!request.body.name || !request.body.number) {
        console.log('e')
        return response.status(404).json({
            error: 'name or number missing'
        })
    }

    const person = new Person ({
        name: request.body.name,
        number: request.body.number,
    })

    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.put('/persons/:id', (request, response, next) => {
    const person = { name: request.body.name, number: request.body.number }

    Person.findByIdAndUpdate(request.params.id, person, { new:true })
        .then(updatedPerson => { response.json(updatedPerson) })
        .catch(error => {next(error)})
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = configs.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
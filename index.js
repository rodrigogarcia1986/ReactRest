const express = require('express');
const person = require('./models/person');
var morgan = require('morgan');
const cors = require('cors')

morgan.token('data', function (req) { return JSON.stringify(req.body) })

const app = express();

app.use(cors())

app.use(express.static('build'))

app.use(express.json());

app.use(morgan(':method :url :status :response-time :data'))

const errorHandler = (error, req, res, next) => {
    console.log("Chegou no error handler")

    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log("entrou neste if")
        return res.status(400).send(error.message)
    }

    //next(error)
    //next()
}


// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

// const fixedId = persons.length;
// let newId = fixedId + 1;

app.get('/api/persons', (req, res) => {

    person.find({}).then(person => res.json(person))

});

app.get('/api/persons/:id', (req, res, next) => {

    const { id } = req.params;

    // const result = persons.find(person => person.id === Number(id));

    // if (isNaN(Number(id))) {
    //     return res.status(400).json({ error: "Id must be a valid number!" });
    // } else if (result === undefined) {
    //     return res.status(404).json({ error: "Name must be unique!" });
    // } else {
    //     return res.json(result);
    // }

    person.findById(id).then(response => {
        if (response) {
            res.json(response)
        } else {
            res.status(404).end()
        }
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {

    const { id } = req.params;

    // const existingContact = persons.find(person => person.id === Number(id));

    // if (isNaN(Number(id))) {
    //     return res.status(400).json({ error: "Id must be a valid number!" });
    // } else if (existingContact === undefined) {
    //     return res.status(404).json({ error: "There is no contact with the informed id" });
    // } else {
    //     persons = persons.filter(person => person.id !== Number(id))
    //     return res.status(204).send();
    // }

    person.findByIdAndDelete(id).then(response => res.json(response))

})

app.post('/api/persons/', (req, res, next) => {

    const { name, number } = req.body;
    console.log("name and number", name, number)

    // const existingContact = person.find(person => person.name === name)

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number must be informed!" })
    }

    person.find({}).then(persons => {
        //console.log('persons: ', persons)

        if (persons.some(person => person.name === name)) {
            console.log("name must be unique")
            return response.status(400).json({
                error: 'name must be unique'
            })

        } else {

            let newPerson = new person({
                name: name,
                number: number
            })

            newPerson.save().then(result => {
                console.log("Person to save", result)
                res.json(result)
            })
                .catch(error => {
                    console.log("Chegou no catch:", error.message)
                    next(error)
                    //res.json(error)
                })
        }
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params
    const { number } = req.body

    const newPerson = {
        number
    }

    person.findByIdAndUpdate(id, newPerson, { new: true })
        .then(result => res.json(result))
        .catch(error => next(error))

})

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
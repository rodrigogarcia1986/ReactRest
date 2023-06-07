const express = require('express');
var morgan = require('morgan');

morgan.token('data', function (req) { return JSON.stringify(req.body) })


const app = express();

app.use(express.json());

app.use(morgan(':method :url :status :response-time :data'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const fixedId = persons.length;
let newId = fixedId + 1;

app.get('/api/persons', (req, res) => {

    const total = persons.length;
    req.timestamp = new Date();

    const result = `<p>Phonebook has info for ${total} people</p> <br/><p>${req.timestamp}<p>`;

    res.json(result);
});

app.get('/api/persons/:id', (req, res) => {

    const { id } = req.params;

    const result = persons.find(person => person.id === Number(id));

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Id must be a valid number!" });
    } else if (result === undefined) {
        return res.status(404).json({ error: "Name must be unique!" });
    } else {
        return res.json(result);
    }
})

app.delete('/api/persons/:id', (req, res) => {

    const { id } = req.params;

    const existingContact = persons.find(person => person.id === Number(id));

    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Id must be a valid number!" });
    } else if (existingContact === undefined) {
        return res.status(404).json({ error: "There is no contact with the informed id" });
    } else {
        persons = persons.filter(person => person.id !== Number(id))
        return res.status(204).send();
    }
})

app.post('/api/persons/', (req, res) => {

    const { name, number } = req.body;

    const existingContact = persons.find(person => person.name === name)


    if (!name || !number) {
        return res.status(400).json({ error: "Name and number must be informed!" });
    } else if (existingContact !== undefined) {
        return res.status(400).json({ error: "The informed name is alread being used!" });
    } else {

        const newObj = {
            id: newId,
            name,
            number
        }

        persons.push(newObj);

        return res.status(201).send();
    }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
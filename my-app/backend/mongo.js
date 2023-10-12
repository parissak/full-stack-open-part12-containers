const mongoose = require('mongoose')
console.log(process.argv.length)

if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log('insufficient arguments')
    process.exit(1)
}

const password = process.argv[2]
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const inputName = process.argv[3]
const inputNumber = process.argv[4]
const person = new Person({
    name: inputName,
    number: inputNumber
})

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, ' ', person.number)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    person.save().then(() => {
        console.log(`added ${inputName} ${inputNumber} to phonebook`)
        mongoose.connection.close()
    })
}
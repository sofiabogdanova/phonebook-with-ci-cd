const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const generateId = () => {
  return Math.floor(Math.random() * Math.floor(1000000))
}

const password = process.argv[2]
const newPersonName = process.argv[3]
const newPersonNumber = process.argv[4]

const url =
    `mongodb+srv://phonebookuser:${password}@cluster0.scmss.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const newPerson = new Person({
  id: generateId(),
  name: newPersonName,
  number: newPersonNumber
})

const app = () => {
  switch(process.argv.length) {
  case 5:
    save(newPerson)
    break
  case 3:
    getAll()
    break
  default:
    break
  }
}

const save = (person) => {
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

const getAll = () => {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}

app()


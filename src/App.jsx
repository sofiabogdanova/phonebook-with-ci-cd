import React, { useState, useEffect } from 'react'

import PersonForm from './personForm'
import Persons from './persons'
import SearchFilter from './searchFilter'
import peopleService from './util/services/persons'
import Notification from './notification'
import './styles.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredValue, setFilteredValue] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([...persons])
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    const existingPersons = persons.filter(p => p.name === newName)
    if(existingPersons.length>0){
      const existingPerson = existingPersons[0]
      if(window.confirm(replaceMessage(existingPerson.name))) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        peopleService.update(existingPerson.id, updatedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : updatedPerson))
            setFilteredPersons(filteredPersons.map(p => p.id !== existingPerson.id ? p : updatedPerson))
          })
          .catch(error => {
            console.log(error)
            setErrorMessage(`Information of ${existingPerson.name} has already been removed from server.`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
      return
    }

    setNewName('')
    setNewNumber('')

    peopleService.create({ name: newName, number: newNumber })
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        if (createdPerson.name.toLocaleLowerCase().startsWith(filteredValue.toLocaleLowerCase())) {
          setFilteredPersons(filteredPersons.concat(createdPerson))
        }
        setSuccessMessage(`Added ${newName}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filteredValueChange = (event) => {
    const filterValue = event.target.value.toLowerCase()
    const newFilteredPersons = persons.filter((p) => {
      return p.name.toLowerCase().startsWith(filterValue)
    })
    setFilteredPersons(newFilteredPersons)
    setFilteredValue(filterValue)
  }

  const deletePerson = (id) => {
    peopleService.deletePerson(id)
      .then(response => {
        console.log(response)
        setPersons(persons.filter(p => p.id !== id))
        setFilteredPersons(filteredPersons.filter(p => p.id !== id))
      }
      )
  }

  useEffect(() => {
    peopleService
      .getAll()
      .then(response => {
        setPersons(response)
        setFilteredPersons(response)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} isError={false}/>
      <Notification message={errorMessage} isError={true}/>
      <SearchFilter filteredValue={filteredValue} filteredValueChange={filteredValueChange} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

const replaceMessage = (name) => {
  return `${name} is already added to phonebook, replace the old number with a new one?`
}

export default App

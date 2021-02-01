import React from 'react'

import './styles.css'

const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <>
      {filteredPersons.map(p => <Person key={p.name} person={p} deletePerson={deletePerson} />)}
    </>)
}

const Person = ({ person, deletePerson }) => {
  const confirmDeletion = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(person.id)
    }
  }

  return (
    <>
      <div className="row">
        <div>{person.name} {person.number} </div>
        <button onClick={confirmDeletion}>delete</button>
      </div>
    </>)
}

export default Persons

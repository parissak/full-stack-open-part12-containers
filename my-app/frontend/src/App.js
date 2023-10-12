import React, { useState, useEffect } from 'react'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService.getAll()
            .then(persons => {
                setPersons(persons)
            })
    }, [])

    const handleNewName = (event) => {
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const deletePerson = (person) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            personService.remove(person.id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== person.id))
                    setNotification({'message':`${person.name} deleted successfully`, 'type':'success'})
                    setTimeout(() => {
                        setNotification(null)
                    }, 2500)
                })
        }
    }

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.map(person => person.name).includes(newName)) {
            if (window.confirm(`${newName} is already added to the phonebook, 
                replace the old number with a new one?`)) {
                const oldP = persons.find(p => p.name === newName)
                const changedP = { ...oldP, number: newNumber }

                personService.update(changedP).then(returnedPerson => {
                    setPersons(persons.map(p => p.id !== oldP.id ? p : returnedPerson))
                    setNewName('')
                    setNewNumber('')

                    setNotification({'message':`${newName}'s number changed successfully`, 'type':'success'})
                    setTimeout(() => {
                        setNotification(null)
                    }, 2500)
                }).catch(error => {
                    setNotification({'message':`${newName} has already been removed`, 'type':'error'})
                    setPersons(persons.filter(p => p.id !== oldP.id))
                    setTimeout(() => {
                        setNotification(null)
                    }, 2500)
                })
            }
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService.create(personObject).then(createdObject => {
                setPersons(persons.concat(createdObject))
                setNewName('')
                setNewNumber('')
            }).then(() => {
                setNotification({'message':`${newName} added successfully`, 'type':'success'})
                setTimeout(() => {
                    setNotification(null)
                }, 2500)
            }).catch(error => {
                setNotification({'message':`Name should contain at least 3 letters and number at least 8 letters`, 'type':'error'})
                setTimeout(() => {
                    setNotification(null)
                }, 2500)
            })
        }
    }

    const handleFilterInput = (event) => {
        setNewFilter(event.target.value)
    }

    let showPersons = persons
    if (newFilter !== '') {
        showPersons = persons.filter(person => person.name.toLowerCase()
            .includes(newFilter.toLowerCase()))
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification info={notification} />

            <FilterForm value={newFilter} change={handleFilterInput} />

            <h3>add a new number</h3>
            <PersonForm addPerson={addPerson} newName={newName} handleNewName={handleNewName}
                newNumber={newNumber} handleNewNumber={handleNewNumber} />

            <h3>Numbers</h3>
            <Persons listPersons={showPersons} handleDeletePerson={deletePerson} />
        </div >
    )
}

export default App
import React from 'react'

const Persons = ({ listPersons, handleDeletePerson }) => {
    return (
        <ul> {listPersons.map(person =>
            <li key={person.id}>  {person.name} {person.number}
                <button onClick={() => handleDeletePerson(person)}> delete</button>
            </li>

        )}
        </ul >
    )
}

export default Persons
const Persons = ({persons, deletePerson}) => (
    persons.map(person =>
        <p key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person)}>delete</button>
        </p>
    )
)

export default Persons  
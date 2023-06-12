const Name = ({ person, handleDelete }) => {

    return <li>Name: {person.name} | Tel: {person.number} | <button onClick={() => {
        console.log("Person id:", person.id)
        handleDelete(person)
    }} type="submit">Delete</button></li>


}

export default Name
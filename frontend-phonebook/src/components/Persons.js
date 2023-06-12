import Name from './Name'

const Persons = ({ contactsToShow, handleDelete }) => {
    return (
        <ul>
            {contactsToShow.map(object => <Name key={object.id} person={object} handleDelete={handleDelete} />)}
        </ul>

    )
}

export default Persons
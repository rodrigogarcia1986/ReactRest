import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import Persons from './components/Persons'
import setContacts from './services/contacts-data'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('Insert new name')

  const [tel, setTel] = useState()

  const [find, setFind] = useState("Type data for search")

  const [showAll, setShowAll] = useState(true)

  const [message, setMessage] = useState()


  // const hook = () => {
  //   console.log("effect")

  //   axios
  //     .get('http://localhost:3001/persons')
  //     .then(response => {
  //       console.log("promise fulfilled")
  //       setPersons(response.data)
  //     })
  // }

  useEffect(() => {
    setContacts
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
        setMessage("Contacts loaded successfully!")
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }, [])

  console.log("render", persons.length, "contacts")


  function updateName(event) {
    console.log(event.target.value)
    setNewName(event.target.value)

  }

  function updateTel(event) {
    console.log(event.target.value)
    setTel(event.target.value)

  }

  function updateFind(event) {
    console.log(event.target.value)
    setFind(event.target.value)

  }

  function handleSubmitNewName(event) {
    event.preventDefault();

    if (persons.find(person => person.name === newName)) {

      const existingName = persons.find(person => person.name === newName)
      console.log("Existing name: ", existingName)


      if (window.confirm(`${existingName.name} has been added already with the phone number ${existingName.number}\nDo you want to replace the number?`)) {

        const nameObject = {
          name: existingName.name,
          number: tel,
          id: existingName.id

        }
        console.log("Name Object: ", nameObject)

        setContacts
          .replace(nameObject)
          .then(returnedPerson => {
            console.log("returnedPerson", returnedPerson)
            const newPersons = persons.filter(person => person.id !== returnedPerson.id)
            setPersons(newPersons.concat(returnedPerson))
            console.log("Returned Person:", returnedPerson, "\nName Object:", nameObject)
            setMessage(`${returnedPerson.name} updated!`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {

      let nameObject = {
        name: newName,
        number: tel
        //id: persons.length + 1

      }

      setContacts
        .create(nameObject)
        .then(returnedPerson => {
          console.log("NameObject", nameObject, "\nReturned person", returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName("Insert next name");
          setTel();
          setMessage(`${returnedPerson.name} added!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log("Qual foi o erro?", error)
          setMessage(error.response.data)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }


  }


  function handleSearch(event) {
    event.preventDefault();

    if (!showAll) {
      setShowAll(true);
      console.log("showAll", showAll)
    } else {
      setShowAll(false);
      console.log("showAll", showAll)
    }

  }

  function handleDelete(toDelete) {
    //event.preventDefault();
    setContacts
      .remove(toDelete.id)
      .then(returned => {
        console.log("returned", returned)

        window.confirm(`Do you want to delete ${toDelete.name}?`)

        const newPersons = persons.filter(person => person.id !== toDelete.id)

        setPersons(newPersons)
        setMessage(`${toDelete.name} deleted!`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)

      })
      .catch(error => {
        console.log("GOT ERROR WHILE EXCLUDING THE SAME ENTRY FROM DIFFERENT BROWSER!")
        setMessage(`${toDelete.name} has already been deleted from the server!`)
      }
      )
  }

  const contactsToShow = showAll ? persons : persons.filter(person => person.name.toLowerCase() === find.toLowerCase());


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />

      < Filter find={find} updateFind={updateFind} handleSearch={handleSearch} />

      <h2>Add new contact</h2>

      <Person newName={newName} updateName={updateName} updateTel={updateTel} tel={tel} handleSubmitNewName={handleSubmitNewName} />

      <h2>Numbers</h2>
      <Persons contactsToShow={contactsToShow} handleDelete={handleDelete} />
    </div>
  )
}


export default App;

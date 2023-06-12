import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}


const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.status)
}

const replace = (changedPerson) => {
    const request = axios.put(`${baseUrl}/${changedPerson.id}`, changedPerson)

    return request.then(response => {
        console.log("response.data: ", response.data)
        return response.data
    })
}



export default {
    getAll,
    create,
    remove,
    replace
}
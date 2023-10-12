import apiClient from '../apiClient'

const getAll = () => {
    const request = apiClient.get('/persons')
    return request.then(response => response.data)
}

const create = (personObject) => {
    const request = apiClient.post('/persons', personObject)
    return request.then(response => response.data)
}

const update = (personObject) => {
    const request = apiClient.put('/persons/' + personObject.id, personObject)
    return request.then(response => response.data)
}

const remove = (personId) => {
    const request = apiClient.delete('/persons/' + personId)
    return request.then(response => response.data)
}

const personService = {
    getAll,
    create,
    remove,
    update
};

export default personService;
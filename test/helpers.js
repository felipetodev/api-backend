const { app } = require('../index')
const supertest = require('supertest')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Contenido de testing en node 1',
    important: true,
    date: new Date()
  },
  {
    content: 'Contenido de testing 2',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes
}

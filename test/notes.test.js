const mongoose = require('mongoose')
const supertest = require('supertest')

const { app, server } = require('../index')
const Note = require('../models/Note')

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

beforeEach(async () => {
  await Note.deleteMany({})
  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about node', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain('Contenido de testing en node 1')
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})

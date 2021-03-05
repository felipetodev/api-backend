require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

Sentry.init({
  dsn: 'https://722feb3fdf3a49ca973c01e4cccf7faa@o542545.ingest.sentry.io/5662456',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findById(id)
    .then(note => {
      if (note) {
        return res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => res.status(200).json(result))
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: note.important || false,
    date: new Date().toISOString()
  })

  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  }).catch(err => next(err))
})

app.use(notFound)

app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = (error, req, res, next) => {
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'MongoError') {
    res.status(409).send({
      error: 'tried to add a duplicated unique value'
    })
  } else {
    res.status(500).end()
  }
}

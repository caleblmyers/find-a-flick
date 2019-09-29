const commentsController = require('express').Router()

const db = require('../../models')
const { JWTVerifier } = require('../../lib/passport');

commentsController.post('/', (req, res) => {
  let { userId, userName, mediaType, tmdbId, body, replyTo } = req.body.comment

  db.Comment.create({
    userId, userName, mediaType, tmdbId, body, replyTo,
    likes: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(comment => res.json(comment))
    .catch(err => res.json(err))
})

commentsController.put('/', JWTVerifier, (req, res) => {
  const { id, body } = req.body

  db.Comment.update(
    {
      body,
      updatedAt: new Date()
    },
    { where: { id } }
  )
    .then(comment => res.json(comment))
    .catch(err => res.json(err))
})

commentsController.delete('/:id', JWTVerifier, (req, res) => {
  const { id } = req.params

  db.Comment.destroy({
    where: { id }
  })
    .then(response => res.json(response))
    .catch(err => res.json(err))
})

commentsController.get('/:id', JWTVerifier, (req, res) => {
  const { id } = req.params

  db.Comment.findAll({
    where: {
      userId: id
    },
    order: [['createdAt', 'DESC']]
  })
    .then(comments => res.json(comments))
    .catch(err => res.json(err))
})

commentsController.get('/:type/:id', (req, res) => {
  const { type, id } = req.params

  db.Comment.findAll({
    where: {
      mediaType: type,
      tmdbId: id
    },
    order: [['id', 'DESC']]
  })
    .then(comments => {
      res.json(comments)
    })
    .catch(err => res.json(err))
})

module.exports = commentsController

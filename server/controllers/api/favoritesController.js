const favoritesController = require('express').Router()

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');

favoritesController.post('/', JWTVerifier, (req, res) => {
  const { mediaType, tmdbId, title, userId } = req.body
  console.log(req.body)
  db.Favorite.create({
    userId,
    mediaType,
    tmdbId,
    title,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(favorite => res.json(favorite))
    .catch(err => res.json(err))
})

favoritesController.get('/people/:id', JWTVerifier, (req, res) => {
  const { id } = req.params
  db.Favorite.findAll({
    where: {
      userId: id,
      mediaType: "person"
    },
    order: [["title", "ASC"]]
  })
    .then(people => res.json(people))
    .catch(err => res.json(err))
})

module.exports = favoritesController;

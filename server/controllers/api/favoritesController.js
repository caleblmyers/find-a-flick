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

module.exports = favoritesController;

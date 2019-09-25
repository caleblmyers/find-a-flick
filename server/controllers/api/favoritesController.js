const favoritesController = require('express').Router()

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');

favoritesController.post('/', JWTVerifier, (req, res) => {
  db.Favorite.create({
    userId: 1,
    mediaType: req.body.type,
    tmdbId: req.body.id,
    title: req.body.title,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(favorite => res.json(favorite))
    .catch(err => res.json(err))
})

module.exports = favoritesController;

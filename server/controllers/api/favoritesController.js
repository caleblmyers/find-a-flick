const favoritesController = require('express').Router()

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');

favoritesController.post('/', JWTVerifier, (req, res) => {
  db.Favorite.create({
    userId: 1,
    mediaType: 'movie',
    tmdbId: 671,
    title: 'test fav'
  })
    .then(favorite => res.json(favorite))
    .catch(err => console.log(err))
})

module.exports = favoritesController;

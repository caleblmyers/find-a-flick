const axios = require('axios')
const tmdbController = require('express').Router();
// const { JWTVerifier } = require('../../lib/passport');
// const db = require('../../models');

tmdbController.post('/search', (req, res) => {
  axios.get(`https://api.themoviedb.org/3/search/multi?query=${req.body.term}&api_key=38050460e68774c8a8cf7af02fac33cc`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.get('/trending', (req, res) => {
  axios.get(`https://api.themoviedb.org/3/trending/all/week?&api_key=38050460e68774c8a8cf7af02fac33cc`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.post('/movie', (req, res) => {
  axios.get('https://api.themoviedb.org/3/movie/78?&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.post('/omdb', (req, res) => {
  axios.get('http://www.omdbapi.com/?t=blade+runner&apikey=31318f4a')
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.post('/people', (req, res) => {
  axios.get('https://api.themoviedb.org/3/search/person?query=Harrison%20Ford&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/person', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/3?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/person/movies', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/3/combined_credits?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/directors', (req, res) => {
  axios.get('https://api.themoviedb.org/3/search/person?query=Ridley%20Scott&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/director', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/578?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

module.exports = tmdbController;
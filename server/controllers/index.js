const axios = require('axios')
const controllers = require('express').Router();

const apiControllers = require('./api');

controllers.get('/netflix', (req, res) => {
  axios.get('https://api.themoviedb.org/3/movie/76341?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(data => res.json(data))
    .catch(err => res.json(err))
})

controllers.use('/api', apiControllers);

module.exports = controllers;

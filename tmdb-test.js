const axios = require('axios')
const express = require('express')

const app = express()
const PORT = 3001

app.get('/search', (req, res) => {
  axios.get('https://api.themoviedb.org/3/search/movie?query=Blade%20Runner&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

app.get('/movie', (req, res) => {
  axios.get('https://api.themoviedb.org/3/movie/78?&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

app.get('/omdb', (req, res) => {
  axios.get('http://www.omdbapi.com/?t=blade+runner&apikey=31318f4a')
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

app.get('/people', (req, res) => {
  axios.get('https://api.themoviedb.org/3/search/person?query=Harrison%20Ford&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

app.get('/person', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/3?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

app.get('/person/movies', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/3/combined_credits?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

app.get('/directors', (req, res) => {
  axios.get('https://api.themoviedb.org/3/search/person?query=Ridley%20Scott&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

app.get('/director', (req, res) => {
  axios.get('https://api.themoviedb.org/3/person/578?api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

app.get('/', (req, res) => {
  res.send("Home Page")
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
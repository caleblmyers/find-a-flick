const axios = require('axios')
const tmdbController = require('express').Router();
// const { JWTVerifier } = require('../../lib/passport');
// const db = require('../../models');
const tmdbURL = 'https://api.themoviedb.org/3'
const tmdbKey = process.env.TMDB_KEY
const omdbKey = process.env.OMDB_KEY

tmdbController.post('/search', (req, res) => {
  axios.get(`${tmdbURL}/search/multi?query=${req.body.data}&include_adult=false&api_key=${tmdbKey}`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.get('/details/:type/:id/:season', (req, res) => {
  const { type, id, season } = req.params
  console.log(type, id, season)
  axios.get(`${tmdbURL}/${type}/${id}/season/${season}?api_key=${tmdbKey}`)
    .then(season => res.json(season.data))
    .catch(err => res.json(err))
})

tmdbController.get('/details/:type/:id', (req, res) => {
  const urlString = `${tmdbURL}/${req.params.type}/${req.params.id}?api_key=${tmdbKey}&append_to_response=combined_credits,tagged_images,credits,images,keywords,recommendations,reviews,similar,videos`
  // axios.get(`${tmdbURL}/tv/60625/season/1?api_key=${tmdbKey}&append_to_response=credits,images,videos`)
  axios.get(urlString)
    .then(movie => res.json(movie.data))
    .catch(err => res.json(err))
})

tmdbController.get('/collection/:id', (req, res) => {
  const { id } = req.params
  axios.get(`${tmdbURL}/collection/${id}?api_key=${tmdbKey}`)
    .then(collection => res.json(collection.data))
    .catch(err => res.json(err))
})

tmdbController.post('/discover', (req, res) => {
  const { type } = req.body
  let {
    cast,
    companies,
    crew,
    certification,
    certificationCountry,
    certificationGt,
    certificationLt,
    genres,
    keywords,
    language,
    noGenres,
    noKeywords,
    people,
    primaryReleaseDateGt,
    primaryReleaseDateLt,
    region,
    releaseDateGt,
    releaseDateLt,
    releaseYear,
    runtimeGt,
    runtimeLt,
    sort,
    voteCountGt,
    voteCountLt,
    voteAverageGt,
    voteAverageLt
  } = req.body.query

  let discoverParams = [
    {
      param: type === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte',
      data: primaryReleaseDateGt
    },
    {
      param: type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte',
      data: primaryReleaseDateLt
    },
    {
      param: 'release_date.gte',
      data: releaseDateGt
    },
    {
      param: 'release_date.lte',
      data: releaseDateLt
    },
    {
      param: type === 'movie' ? 'primary_release_year' : 'first_air_date_year',
      data: releaseYear
    },
    {
      param: 'vote_count.gte',
      data: voteCountGt
    },
    {
      param: 'vote_count.lte',
      data: voteCountLt
    },
    {
      param: 'vote_average.gte',
      data: voteAverageGt
    },
    {
      param: 'vote_average.lte',
      data: voteAverageLt
    },
    {
      param: 'sort_by',
      data: sort
    },
    {
      param: 'certification_country',
      data: certificationCountry
    },
    {
      param: 'certification',
      data: certification
    },
    {
      param: 'certification.lte',
      data: certificationLt
    },
    {
      param: 'certification.gte',
      data: certificationGt
    },
    {
      param: 'with_runtime.lte',
      data: runtimeLt
    },
    {
      param: 'with_runtime.gte',
      data: runtimeGt
    },
    {
      param: 'region',
      data: region
    },
    {
      param: 'language',
      data: language
    },
    {
      param: 'with_genres',
      data: genres
    },
    {
      param: 'without_genres',
      data: noGenres
    },
    {
      param: 'with_cast',
      data: cast
    },
    {
      param: 'with_crew',
      data: crew
    },
    {
      param: 'with_companies',
      data: companies
    },
    {
      param: 'with_people',
      data: people
    },
    {
      param: 'with_keywords',
      data: keywords
    },
    {
      param: 'without_keywords',
      data: noKeywords
    }
  ]

  let queries = discoverParams.filter(param => param.data !== '')

  let queryString = ``
  queries.forEach(query => {
    queryString += `&${query.param}=${query.data}`
  })
  console.log(queryString)

  axios.get(`${tmdbURL}/discover/${type}?api_key=${tmdbKey}&include_adult=false${queryString}`)
    .then(data => res.json(data.data))
    .catch(err => res.json(err))
})

tmdbController.get('/ratings', (req, res) => {
  axios.get(`${tmdbURL}/certification/movie/list?api_key=${tmdbKey}`)
    .then(ratings => res.json(ratings.data))
    .catch(err => res.json(err))
})

tmdbController.get('/now_playing', (req, res) => {
  axios.get(`${tmdbURL}/movie/now_playing?api_key=${tmdbKey}`)
    .then(nowPlaying => {
      res.json(nowPlaying.data)
    })
    .catch(err => res.json(err))
})

tmdbController.get('/popular/:type', (req, res) => {
  axios.get(`${tmdbURL}/${req.params.type}/popular?api_key=${tmdbKey}`)
    .then(popular => {
      res.json(popular.data)
    })
    .catch(err => res.json(err))
})

tmdbController.get('/:type/top_rated', (req, res) => {
  axios.get(`${tmdbURL}/${req.params.type}/top_rated?api_key=${tmdbKey}&region=US`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.get('/trending/:type', (req, res) => {
  axios.get(`${tmdbURL}/trending/${req.params.type}/week?api_key=${tmdbKey}`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

tmdbController.get('/coming_soon', (req, res) => {
  axios.get(`${tmdbURL}/movie/upcoming?api_key=${tmdbKey}`)
    .then(comingSoon => {
      res.json(comingSoon.data)
    })
    .catch(err => res.json(err))
})

tmdbController.get('/genres', (req, res) => {
  let genres = {}
  axios.get(`${tmdbURL}/genre/movie/list?api_key=${tmdbKey}`)
    .then(movie => {
      axios.get(`${tmdbURL}/genre/tv/list?api_key=${tmdbKey}`)
        .then(tv => {
          genres.movie = movie.data
          genres.tv = tv.data
          res.json(genres)
        })
        .catch(err => res.json(err))
    })
    .catch(err => res.json(err))
})

tmdbController.post('/people', (req, res) => {
  axios.get(`${tmdbURL}/search/person?query=Harrison%20Ford&api_key=${tmdbKey}`)
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/directors', (req, res) => {
  axios.get(`${tmdbURL}/search/person?query=Ridley%20Scott&api_key=${tmdbKey}`)
    .then(response => {
      console.dir(response.data)
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/director', (req, res) => {
  axios.get(`${tmdbURL}/person/578?api_key=${tmdbKey}`)
    .then(response => {
      res.json(response.data)
    })
    .catch(err => res.json(err))
})

tmdbController.post('/omdb', (req, res) => {
  axios.get(`http://www.omdbapi.com/?t=blade+runner&apikey=${omdbKey}`)
    .then(response => res.json(response.data))
    .catch(err => res.json(err))
})

module.exports = tmdbController;
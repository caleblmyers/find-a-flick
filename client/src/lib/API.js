import axios from 'axios';

export default {
  Comments: {
    add: function (comment, token) {
      return axios.post('/api/comments', { comment }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    pageComments: function (type, id) {
      return axios.get(`api/comments/${type}/${id}`)
    }
  },

  Favorites: {
    add: function (mediaType, tmdbId, title, userId, token) {
      return axios.post('/api/favorites', { mediaType, tmdbId, title, userId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    people: function (id, token) {
      return axios.get(`/api/favorites/people/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
  },

  News: {
    get: function () {
      return axios.get('/api/tmdb/news');
    }
  },

  TMDB: {
    comingSoon: function () {
      return axios.get('/api/tmdb/coming_soon')
    },
    genres: function () {
      return axios.get('/api/tmdb/genres')
    },
    details: function (type, id) {
      if (!type) type = 'movie'
      return axios.get(`/api/tmdb/details/${type}/${id}`)
    },
    discover: function (query) {
      return axios.post('api/tmdb/discover', { query })
    },
    nowPlaying: function () {
      return axios.get('/api/tmdb/now_playing')
    },
    popular: function (type) {
      return axios.get(`/api/tmdb/popular/${type}`)
    },
    ratings: function (type) {
      return axios.get('/api/tmdb/ratings')
    },
    search: function (data) {
      return axios.post('/api/tmdb/search', { data })
    },
    topRated: function (type) {
      return axios.get(`/api/tmdb/${type}/top_rated`)
    },
    trending: function (type) {
      return axios.get(`/api/tmdb/trending/${type}`)
    }
  },

  Users: {
    login: function (username, password) {
      return axios.post('/api/users/login', { username, password });
    },
    getFavorites: function (id, token) {
      return axios.get(`/api/users/${id}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    getMe: function (token) {
      return axios.get('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    register: function (username, email, password) {
      return axios.post('/api/users', { username, email, password });
    }
  },

  Secrets: {
    getAll: function (authToken) {
      return axios.get('/api/secrets', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }
  }
}

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
    delete: function (id, token) {
      return axios.delete(`/api/comments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    edit: function (id, body, token) {
      return axios.put('/api/comments/', { id, body }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    pageComments: function (type, id) {
      return axios.get(`api/comments/${type}/${id}`)
    },
    userComments: function (id, token) {
      return axios.get(`/api/comments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
    delete: function (id, token) {
      return axios.delete(`/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    },
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
    },
    update: function (field, value, id, token) {
      return axios.put('/api/users/', { field, value, id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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

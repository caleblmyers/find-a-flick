import axios from 'axios';

export default {
  Favorites: {
    add: function (type, id, title, token) {
      return axios.post('/api/favorites', { type, id, title }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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
      return axios.get(`/api/tmdb/details/${type}/${id}`)
    },
    nowPlaying: function () {
      return axios.get('/api/tmdb/now_playing')
    },
    popular: function (type) {
      return axios.get(`/api/tmdb/popular/${type}`)
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
    login: function (email, password) {
      return axios.post('/api/users/login', { email, password });
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
    register: function (email, password) {
      return axios.post('/api/users', { email, password });
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

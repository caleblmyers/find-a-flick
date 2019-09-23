import axios from 'axios';

export default {
  TMDB: {
    search: function (type, data) {
      return axios.post(`/api/tmdb/${type}`, { data })
    },
    trending: function (type) {
      return axios.get(`/api/tmdb/trending/${type}`)
    }
  },

  Users: {
    login: function (email, password) {
      return axios.post('/api/users/login', { email, password });
    },

    // create: function (email, password) {
    //   return axios.post('/api/users', { email, password });
    // },

    getMe: function (authToken) {
      return axios.get('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
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

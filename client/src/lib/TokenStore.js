class TokenStore {
  static setToken = (token) => localStorage.setItem('token', token)

  static getToken = () => localStorage.getItem('token')

  static clearToken = () => localStorage.removeItem('token')
}

export default TokenStore

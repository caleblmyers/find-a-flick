import React, { Component } from 'react'

import AuthContext from '../../contexts/AuthContext'
import API from '../../lib/API'

class Favorites extends Component {
  static contextType = AuthContext

  state = {
    favorites: []
  }

  componentDidMount() {
    API.Users.getFavorites(this.context.user.id, this.context.authToken)
      .then(res => res.data)
      .then(favorites => this.setState({ favorites }))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <h1>Favorites</h1>
      </div>
    )
  }
}

export default Favorites

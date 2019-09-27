import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import API from '../../lib/API'
import AuthContext from '../../contexts/AuthContext'

class Favorites extends Component {
  static contextType = AuthContext

  state = {
    favorites: [],
    isLoading: true
  }

  componentDidMount() {
    API.Users.getFavorites(this.context.user.id, this.context.authToken)
      .then(res => res.data)
      .then(favorites => this.setState({
        favorites,
        isLoading: false
      }))
      .catch(err => console.log(err))
  }

  render() {
    const { favorites, isLoading } = this.state

    return (
      <div>
        <h1>Favorites</h1>
        {isLoading ? (
          <div>
            Loading...
          </div>
        ) : (
            <div className="row">
              {favorites.map(favorite => (
                <div className="col-12">
                  <div className="h4">{favorite.title}</div>
                  <Link to={{
                    pathname: '/details',
                    state: {
                      type: favorite.mediaType,
                      id: favorite.tmdbId
                    }
                  }}>
                    <button className="btn btn-info">
                      Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
      </div>
    )
  }
}

export default Favorites

import React, { Component } from 'react'

import API from '../../lib/API'

class Genres extends Component {
  state = {
    genres: {}
  }

  componentDidMount() {
    API.TMDB.genres()
      .then(genres => console.log(genres.data))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <h1>Genres</h1>
      </div>
    )
  }
}

export default Genres

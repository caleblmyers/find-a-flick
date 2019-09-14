import React, { Component } from 'react';

import API from '../../lib/API'
import Featured from '../../components/Featured'

class HomePage extends Component {
  state = {
    featured: []
  }

  componentDidMount() {
    API.TMDB.trending()
      .then(res => {
        console.log(res.data)
        this.setState({ featured: res.data.results })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className='Home'>
        <Featured featured={this.state.featured} />
      </div>
    );
  }
}

export default HomePage;

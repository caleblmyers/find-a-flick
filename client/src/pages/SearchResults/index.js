import React, { Component } from 'react';

import API from '../../lib/API'

class SearchResults extends Component {
  state = {
    results: []
  }

  componentDidMount() {
    API.TMDB.search("search", this.props.location.state)
      .then(res => {
        console.log(res.data)
        this.setState({ results: res.data.results })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className='SearchResults'>
        <div className="display-4">Search Results</div>
        <div className="container">
          <div className="row">
            {this.state.results.map(result => (
              <div className="col-3" key={result.id}>
                <div className="card">
                  <img src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="card-title h6">{result.original_title}</div>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;

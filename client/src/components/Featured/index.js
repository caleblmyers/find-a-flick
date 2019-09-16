import React, { Component } from 'react'

import "./style.css"
import API from "../../lib/API"

class Featured extends Component {
  state = {
    featured: [],
    isLoaded: false
  }

  componentDidMount() {
    API.TMDB.trending()
      .then(res => {
        this.setState({
          featured: res.data.results,
          isLoaded: true
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="Featured">
        <div className="display-4">Featured</div>
        <div className="container">
          <div className="row">
            <div className="col">
              {this.state.isLoaded &&
                <div className="mx-auto" id="div-featured">
                  <img className="img-fluid" id="img-featured" src={`https://image.tmdb.org/t/p/original/${this.state.featured[0].backdrop_path}`} alt="..." />
                </div>}
            </div>
            {/* {this.props.featured.map(feature => (
              <div className="col-3" key={feature.id}>
                <div className="card">
                  <img src={`https://image.tmdb.org/t/p/original/${feature.backdrop_path}`} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="card-title h6">{feature.original_title}</div>
                    <p className="card-text">{feature.overview}</p>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    )
  }
}

export default Featured
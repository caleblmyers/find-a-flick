import React, { Component } from 'react'

class Featured extends Component {
  render() {
    return (
      <div className="Featured">
        <div className="display-4">Featured</div>
        <div className="container">
          <div className="row">
            {this.props.featured.map(feature => (
              <div className="col-3" key={feature.id}>
                <div className="card">
                  <img src={`https://image.tmdb.org/t/p/original/${feature.backdrop_path}`} className="card-img-top" alt="..." />
                  <div className="card-body">
                    <div className="card-title h6">{feature.original_title}</div>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Featured
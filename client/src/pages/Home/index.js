import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './style.css'
import API from "../../lib/API"
// import Featured from '../../components/Featured'

class HomePage extends Component {
  state = {
    movies: [],
    movieIndex: 0,
    shows: [],
    showIndex: 0,
    isLoaded: false
  }

  componentDidMount() {
    API.TMDB.trending('movie')
      .then(movies => {
        API.TMDB.trending('tv')
          .then(shows => {
            this.setState({
              movies: movies.data.results,
              shows: shows.data.results,
              isLoaded: true
            })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  changeSlide = (type, e) => {
    let i = this.state[`${type}Index`]
    e.target.id === "next" ? i++ : i--
    if (i >= this.state[`${type}s`].length) i = 0
    else if (i <= -1) i = this.state[`${type}s`].length - 1

    if (type === 'movie') this.setState({ movieIndex: i })
    else this.setState({ showIndex: i })
  }

  goToSlide = e => {
    this.setState({ movieIndex: e.target.id.slice(5) })
  }

  render() {
    return (
      <div className='Home'>
        <div className="Featured">
          <div className="display-4">Featured</div>
          <div className="row no-gutters">
            <div className="col-6">
              <div className="h5">Movies</div>
              {this.state.isLoaded &&
                <div>
                  <div className="mx-auto" id="div-featured">
                    <img className="img-fluid" id="img-featured" src={`https://image.tmdb.org/t/p/original/${this.state.movies[this.state.movieIndex].backdrop_path}`} alt="..." />
                    <Link to={{
                      pathname: '/details',
                      state: {
                        id: this.state.movies[this.state.movieIndex].id
                      }
                    }}>
                      <div id="caption"><strong>{this.state.movies[this.state.movieIndex].title}</strong></div>
                    </Link>
                    <button onClick={event => this.changeSlide('movie', event)} className="btn" id="prev">&#10094;</button>
                    <button onClick={event => this.changeSlide('movie', event)} className="btn" id="next">&#10095;</button>
                  </div>
                  <div className="mx-auto" id="dot-container">
                    {this.state.movies.map((feature, index) => (
                      <span onClick={event => this.goToSlide('movie', event)} className={`dot ${index === this.state.movieIndex ? 'activeDot' : 'inactiveDot'}`} key={index} id={`movie${index}`}></span>
                    ))}
                  </div>
                </div>}
            </div>
            <div className="col-6">
              <div className="h5">TV Shows</div>
              {this.state.isLoaded &&
                <div>
                  <div className="mx-auto" id="div-featured">
                    <img className="img-fluid" id="img-featured" src={`https://image.tmdb.org/t/p/original/${this.state.shows[this.state.showIndex].backdrop_path}`} alt="..." />
                    <Link to={{
                      pathname: '/details',
                      state: {
                        id: this.state.shows[this.state.showIndex].id
                      }
                    }}>
                      <div id="caption"><strong>{this.state.shows[this.state.showIndex].name}</strong></div>
                    </Link>
                    <button onClick={event => this.changeSlide('show', event)} className="btn" id="prev">&#10094;</button>
                    <button onClick={event => this.changeSlide('show', event)} className="btn" id="next">&#10095;</button>
                  </div>
                  <div className="mx-auto" id="dot-container">
                    {this.state.shows.map((feature, index) => (
                      <span onClick={event => this.goToSlide('show', event)} className={`dot ${index === this.state.showIndex ? 'activeDot' : 'inactiveDot'}`} key={index} id={`movie${index}`}></span>
                    ))}
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;

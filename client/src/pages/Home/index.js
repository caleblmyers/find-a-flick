import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './style.css'
import API from "../../lib/API"
import SearchBar from '../../components/SearchBar';
// import Featured from '../../components/Featured'

class HomePage extends Component {
  state = {
    movies: [],
    movieIndex: 0,
    topMovies: [],
    topMovieIndex: 0,
    shows: [],
    showIndex: 0,
    popular: {},
    isLoaded: false
  }

  componentDidMount() {
    API.TMDB.trending('movie')
      .then(movies => {
        API.TMDB.trending('tv')
          .then(shows => {
            API.TMDB.popular()
              .then(popular => {
                API.TMDB.topRated('movie')
                  .then(topMovie => {
                    this.setState({
                      movies: movies.data.results,
                      topMovies: topMovie.data.results,
                      shows: shows.data.results,
                      popular: popular.data,
                      isLoaded: true
                    })
                  })
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
    else if (type === 'topMovie') this.setState({ topMovieIndex: i })
    else this.setState({ showIndex: i })
  }

  goToSlide = (type, e) => {
    if (type === 'movie') this.setState({ movieIndex: e.target.id.slice(5) })
    else if (type === 'topMovie') this.setState({ topNovieIndex: e.target.id.slice(8) })
    else this.setState({ showIndex: e.target.id.slice(4) })
  }

  render() {
    return (
      <div className='Home'>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="display-3">Pop Media</div>
            <div className="lead pt-2">Discover something new!</div>
            <SearchBar />
          </div>
        </div>
        <div className="Featured">
          <div className="h2 text-center">Movies</div>
          <div className="row no-gutters">
            <div className="col-12 col-md-6 p-3">
              {this.state.isLoaded &&
                <div>
                  <div className="h5">Featured</div>
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
                  <div className="h5">Top Rated</div>
                  <div className="mx-auto" id="div-featured">
                    <img className="img-fluid" id="img-featured" src={`https://image.tmdb.org/t/p/original/${this.state.topMovies[this.state.topMovieIndex].backdrop_path}`} alt="..." />
                    <Link to={{
                      pathname: '/details',
                      state: {
                        id: this.state.topMovies[this.state.topMovieIndex].id
                      }
                    }}>
                      <div id="caption"><strong>{this.state.topMovies[this.state.topMovieIndex].title}</strong></div>
                    </Link>
                    <button onClick={event => this.changeSlide('topMovie', event)} className="btn" id="prev">&#10094;</button>
                    <button onClick={event => this.changeSlide('topMovie', event)} className="btn" id="next">&#10095;</button>
                  </div>
                  <div className="mx-auto" id="dot-container">
                    {this.state.topMovies.map((feature, index) => (
                      <span onClick={event => this.goToSlide('topMovie', event)} className={`dot ${index === this.state.topMovieIndex ? 'activeDot' : 'inactiveDot'}`} key={index} id={`topMovie${index}`}></span>
                    ))}
                  </div>
                </div>}
            </div>
            <div className="col-6 col-md-3 p-3">
              Top Rated
            </div>
            <div className="col-6 col-md-3 p-3">
              In Theaters
            </div>
          </div>

          <div className="h2 text-center">TV Shows</div>
          <div className="row no-gutters">
            <div className="col-12 col-md-6 p-3">
              <div className="h5">Featured</div>
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
                      <span onClick={event => this.goToSlide('show', event)} className={`dot ${index === this.state.showIndex ? 'activeDot' : 'inactiveDot'}`} key={index} id={`show${index}`}></span>
                    ))}
                  </div>
                </div>}
            </div>
            <div className="col-6 col-md-3 p-3">
              Top Rated
            </div>
            <div className="col-6 col-md-3 p-3">
              On Tonight
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;

import React, { Component } from 'react';

import './style.css'
import AuthContext from '../../contexts/AuthContext'
import API from "../../lib/API"
import SearchBar from '../../components/SearchBar';
import Carousel from '../../components/Carousel';
import Table from '../../components/Table';

class HomePage extends Component {
  static contextType = AuthContext

  state = {
    movies: [],
    topMovies: [],
    nowPlaying: [],
    shows: [],
    topShows: [],
    popularShows: [],
    isLoaded: false
  }

  componentDidMount() {
    API.TMDB.trending('movie')
      .then(movies => {
        API.TMDB.topRated('movie')
          .then(topMovies => {
            API.TMDB.nowPlaying()
              .then(nowPlaying => {
                API.TMDB.trending('tv')
                  .then(shows => {
                    API.TMDB.topRated('tv')
                      .then(topShows => {
                        API.TMDB.popular('tv')
                          .then(popularShows => {
                            // console.log(movies.data)
                            // console.log(topMovies.data)
                            // console.log(nowPlaying.data)
                            // console.log(shows.data)
                            // console.log(topShows.data)
                            // console.log(popularShows.data)
                            this.setState({
                              movies: movies.data.results,
                              topMovies: topMovies.data.results,
                              nowPlaying: nowPlaying.data.results,
                              shows: shows.data.results,
                              topShows: topShows.data.results,
                              popularShows: popularShows.data.results,
                              isLoaded: true
                            })
                          })
                      })
                  })
              })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  submitHandler = e => {
    e.preventDefault()
  }

  render() {
    return (
      <div className='Home'>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="display-3">Pop Media</div>
            <div className="lead pt-2">Discover something new!</div>
            <SearchBar handler={e => this.submitHandler(e)} />
          </div>
        </div>

        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
            <div className="Featured">
              <div className="h2 text-center">Movies</div>
              <div className="row no-gutters">
                <div className="col-12 col-md-8">
                  <div className="row no-gutters">
                    <div className="col-12 col-lg-6 p-3">
                      <div className="h5">Featured</div>
                      <Carousel data={this.state.movies} type={"movie"} handler={console.log} />
                    </div>
                    <div className="col-12 col-lg-6 p-3">
                      <div className="h5">Top Rated</div>
                      <Carousel data={this.state.topMovies} type={"topMovie"} handler={console.log} />
                    </div>
                  </div>
                  {/* <div className="row no-gutters">
                    <div className="col-12">
                      <div className="h5">Editor Picks</div>
                    </div>
                  </div> */}
                </div>
                <div className="col-12 col-md-4 p-3">
                  <div className="h5">In Theaters</div>
                  <Table dataSet={this.state.nowPlaying.slice(0, 10)} type="movie" />
                </div>
              </div>

              <div className="h2 text-center">TV Shows</div>
              <div className="row no-gutters">
                <div className="col-12 col-md-8">
                  <div className="row no-gutters">
                    <div className="col-12 col-lg-6 p-3">
                      <div className="h5">Featured</div>
                      <Carousel data={this.state.shows} type={"show"} handler={console.log} />
                    </div>
                    <div className="col-12 col-lg-6 p-3">
                      <div className="h5">Top Rated</div>
                      <Carousel data={this.state.topShows} type={"topShow"} handler={console.log} />
                    </div>
                  </div>
                  {/* <div className="row no-gutters">
                    <div className="col-12">
                      <div className="h5">Editor Picks</div>
                    </div>
                  </div> */}
                </div>
                <div className="col-12 col-md-4 p-3">
                  <div className="h6">Today's Most Popular</div>
                  <Table dataSet={this.state.popularShows.slice(0, 10)} type="show" />
                </div>
              </div>
            </div>)}
      </div>
    )
  }
}

export default HomePage

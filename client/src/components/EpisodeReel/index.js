import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import MediaTall from '../../img/media_placeholder_tall.png'
import API from '../../lib/API'
import Carousel from '../Carousel'
import moment from 'moment'

class EpisodeReel extends Component {
  state = {
    isLoading: true,
    slide: 0,
    maxSlide: this.props.data.length - 1,
    season: {}
  }

  componentDidMount() {
    const { data } = this.props
    if (data.length > 0) {
      this.getSeason(0)
    }
  }

  getSeason = slide => {
    const { type, id } = this.props

    API.TMDB.season(type, id, slide)
      .then(season => {
        console.log(season.data)
        this.setState({
          slide,
          season: season.data,
          isLoading: false
        })
      })
      .catch(err => console.log(err))
  }

  changeSlide = (slide, e) => {
    this.setState({ isLoading: true })
    if (e.target.id === "next") this.getSeason(slide + 1)
    else this.getSeason(slide - 1)
  }

  render() {
    const { data, type, id } = this.props
    const { slide, maxSlide, season, isLoading } = this.state
    const displayPrev = slide === 0 ? 'd-none' : ''
    const displayNext = (slide >= maxSlide) ? 'd-none' : ''

    if (data.length === 0) {
      return (
        <div className="row bg-light-grey py-2 border-round" id="">
          <div className="col-12 px-3 py-2 align-self-center">
            <div className="h6">Data Unavailable</div>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="EpisodeReel position-relative row justify-content-center bg-light-grey border-round py-2 p-3" id="data-container">
          <div className="align-center" id="loader">
            <div className="bounce-loader mt-4">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="EpisodeReel position-relative row justify-content-center bg-light-grey border-round py-2 p-3" id="data-container">
        <button
          id="prev"
          className={`btn ${displayPrev}`}
          onClick={event => this.changeSlide(slide, event)}
        >
          &#10094;
        </button>
        <button
          id="next"
          className={`btn ${displayNext}`}
          onClick={event => this.changeSlide(slide, event)}
        >
          &#10095;
        </button>
        <div className="card mb-3">
          <div className="row no-gutters">
            <div className="col-md-4 my-auto p-3">
              <img
                alt={season.name}
                className="card-img-top img-fluid"
                src={
                  season.poster_path
                    ? `https://image.tmdb.org/t/p/original/${season.poster_path}`
                    : MediaTall}
              />
            </div>
            <div className="col-md-8 text-center">
              <div className="card-body">
                <h5 className="mb-0 card-title"><strong>{season.name || season.title}</strong></h5>
                <p className="mb-0 card-text"><small className="text-muted">{moment(season.air_date).format("MMMM Do, YYYY")}</small></p>
                <p className="text-sm">{season.overview.slice(0, 255)}...</p>
                <div className="row">
                  <div className="col-10 mx-auto">
                    <Carousel data={season.episodes} type="episodes" handler={console.log} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EpisodeReel

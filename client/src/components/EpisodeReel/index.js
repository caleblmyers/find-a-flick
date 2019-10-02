import React, { Component } from 'react'

import './style.css'
import API from '../../lib/API'
import Carousel from '../Carousel'
import moment from 'moment'
import MediaTall from '../../img/media_placeholder_tall.png'

class EpisodeReel extends Component {
  state = {
    isLoading: true,
    slide: 0,
    maxSlide: this.props.data.length - 1,
    season: {},
    collection: {},
    error: false
  }

  componentDidMount() {
    const { type, data } = this.props
    if (type === "movie") {
      return this.getCollection()
    }

    if (data.length > 0) {
      this.getSeason(0)
    }
  }

  getSeason = slide => {
    const { type, id } = this.props

    API.TMDB.season(type, id, slide)
      .then(season => {
        console.log(season.data)
        if (season.data.name === "Error") return this.setState({ error: true })
        this.setState({
          slide,
          season: season.data,
          isLoading: false
        })
      })
      .catch(err => console.log(err))
  }

  getCollection = () => {
    const { id } = this.props

    API.TMDB.collection(id)
      .then(collection => {
        console.log(collection.data)
        if (collection.data.name === "Error") return this.setState({ error: true })
        this.setState({
          collection: collection.data,
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
    const { data, type } = this.props
    const { slide, maxSlide, season, collection, isLoading, error } = this.state
    const displayPrev = slide === 0 ? 'd-none' : ''
    const displayNext = (slide >= maxSlide) ? 'd-none' : ''

    const content = type === "movie" ? collection : season

    if (data.length === 0 || error) {
      return (
        <div className="row bg-light-grey py-2 border-round" id="">
          <div className="col-12 px-3 py-2 align-self-center">
            <div className="h6"><strong>Data Unavailable</strong></div>
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
          className={`btn ${type === "movie" ? 'd-none' : displayPrev}`}
          onClick={event => this.changeSlide(slide, event)}
        >
          &#10094;
        </button>
        <button
          id="next"
          className={`btn ${type === "movie" ? 'd-none' : displayNext}`}
          onClick={event => this.changeSlide(slide, event)}
        >
          &#10095;
        </button>
        <div className="card bg-light-grey border-0 mb-3">
          <div className="row no-gutters">
            <div className="col-10 col-md-4 my-auto mx-auto p-3">
              <img
                alt={content.name}
                className="card-img-top img-fluid"
                src={
                  content.poster_path
                    ? `https://image.tmdb.org/t/p/original/${content.poster_path}`
                    : MediaTall}
              />
            </div>
            <div className="col-12 col-md-8 text-center">
              <div className="card-body">
                <h5 className="mb-0 card-title"><strong>{content.name || content.title}</strong></h5>
                <p className="mb-0 card-text"><small className="text-muted">{moment(content.air_date).format("MMMM Do, YYYY")}</small></p>
                {content.overview && <p className="text-sm">{content.overview.length > 255 ? `${content.overview.slice(0, 255)}...` : content.overview}</p>}
                {(content.episodes || content.parts) && <div className="row">
                  <div className="col-12 col-md-10 mx-auto" id="carousel-container">
                    <Carousel data={content.episodes || content.parts} type={type === "tv" ? "episodes" : type} handler={console.log} />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EpisodeReel

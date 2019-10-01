import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Person from '../../img/person_placeholder.png'
import MediaTall from '../../img/media_placeholder_tall.png'

class CastSlider extends Component {
  state = {
    slide: 1,
    maxSlide: Math.ceil(this.props.cast.length / 4)
  }

  changeSlide = (slide, e) => {
    if (e.target.id === "next") this.setState({ slide: slide + 1 })
    else this.setState({ slide: slide - 1 })
  }

  render() {
    const { cast } = this.props
    const { slide, maxSlide } = this.state
    const displayPrev = slide === 1 ? 'd-none' : ''
    const displayNext = (slide >= maxSlide) ? 'd-none' : ''
    
    if (cast.length === 0) {
      return (
        <div className="row bg-light-grey py-2 border-round" id="">
          <div className="col-12 px-3 py-2 align-self-center">
            <div className="h6">Cast Unavailable</div>
          </div>
        </div>
      )
    }

    return (
      <div className="CastSlider position-relative row justify-content-center bg-light-grey py-2" id="cast-container">
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
        {cast.slice(((slide - 1) * 4), (slide * 4)).map(credit => (
          <div className="col-2 col-md-2 px-0 py-2 mx-1 align-self-center" key={credit.credit_id || credit.id}>
            <Link
              className="no-link"
              to={`/details/${credit.media_type || "person"}/${credit.id}`}
              onClick={() => this.props.handler(credit.media_type || "person", credit.id)}
            >
              <div className="card">
                <img
                  alt={credit.name}
                  className="card-img-top"
                  src={
                    (credit.profile_path || credit.poster_path)
                      ? `https://image.tmdb.org/t/p/original/${credit.profile_path || credit.poster_path}`
                      : this.props.type === "person" ? MediaTall : Person}
                />
                <div className="pl-1 py-3">
                  <div className="text-sm"><strong>{credit.name || credit.title}</strong></div>
                  <div className="text-xs">{credit.character || credit.job}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  }
}

export default CastSlider

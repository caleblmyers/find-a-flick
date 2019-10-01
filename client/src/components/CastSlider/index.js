import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class CastSlider extends Component {
  state = {
    slide: 1,
    maxSlide: Math.ceil(this.props.cast.length / 5)
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
        <button onClick={event => this.changeSlide(slide, event)} className={`btn ${displayPrev}`} id="prev">&#10094;</button>
        <button onClick={event => this.changeSlide(slide, event)} className={`btn ${displayNext}`} id="next">&#10095;</button>
        {cast.slice(((slide - 1) * 5), (slide * 5)).map(credit => (
          <div className="col-4 col-md-2 px-0 py-2 mx-1 align-self-center" key={credit.id}>
            <Link onClick={() => this.props.handler(credit.media_type || "person", credit.id)} className="no-link" to={{
              pathname: `/details/${credit.media_type || "person"}/${credit.id}`,
              state: {
                type: credit.media_type || "person",
                id: credit.id
              }
            }}>
              <div className="card">
                <img src={`https://image.tmdb.org/t/p/original/${credit.profile_path || credit.poster_path}`} className="card-img-top" alt={credit.name} />
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

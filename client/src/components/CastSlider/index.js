import React, { Component } from 'react'

class CastSlider extends Component {
  state = {
    slide: 1,
    maxSlide: 0
  }

  componentDidMount() {
    this.setState({ maxSlide: Math.floor(this.props.cast.length / 5) })
  }

  changeSlide = (slide, e) => {
    if (e.target.id === "next") this.setState({ slide: slide + 1 })
    else this.setState({ slide: slide - 1 })
  }

  render() {
    const { cast } = this.props
    const { slide, maxSlide } = this.state
    const displayPrev = slide === 1 ? 'd-none' : ''
    const displayNext = (slide > maxSlide) ? 'd-none' : ''

    return (
      <div className="CastSlider position-relative row justify-content-center bg-light-grey py-2" id="cast-container">
        <button onClick={event => this.changeSlide(slide, event)} className={`btn ${displayPrev}`} id="prev">&#10094;</button>
        <button onClick={event => this.changeSlide(slide, event)} className={`btn ${displayNext}`} id="next">&#10095;</button>
        {cast.slice(((slide - 1) * 5), (slide * 5)).map(person => (
          <div className="col-4 col-md-2 px-0 py-2 mx-1 align-self-center" key={person.id}>
            <div className="card">
              <img src={`https://image.tmdb.org/t/p/original/${person.profile_path}`} className="card-img-top" alt={person.name} />
              <div className="pl-1 py-3">
                <div className="text-sm"><strong>{person.name}</strong></div>
                <div className="text-xs">{person.character}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default CastSlider

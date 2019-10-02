import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Media from '../../img/media_placeholder.png'

class Carousel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      index: 0,
    }
  }

  componentDidUpdate() {
    const { data } = this.props
    if (data !== this.state.data) this.setState({
      index: 0,
      data
    })
  }

  changeSlide = e => {
    let { index } = this.state
    e.target.id === "next" ? index++ : index--
    if (index >= this.props.data.length) index = 0
    else if (index <= -1) index = this.props.data.length - 1
    this.setState({ index })
  }

  goToSlide = (type, e) => this.setState({ index: e.target.id.slice(type.length) })

  render() {
    const { data, index } = this.state
    const { type } = this.props

    let mediaType
    if (type === "movie" || type === "topMovie") mediaType = "movie"
    else if (type === "show" || type === "topShow") mediaType = "tv"
    else mediaType = type

    return (
      <div className="Carousel">
        <div className="mx-auto div-featured">
          <img
            id="img-featured"
            className="img-fluid"
            alt={data[index].title || data[index].name}
            src={data[index].backdrop_path
              ? `https://image.tmdb.org/t/p/original/${data[index].backdrop_path}`
              : (type === "episodes" && data[index].still_path)
                ? `https://image.tmdb.org/t/p/original/${data[index].still_path}`
                : Media}
          />
          {type === "episodes"
            ? <div id="caption"><strong>{data[index].title || data[index].name}</strong></div>
            : <Link
              to={`/details/${mediaType}/${data[index].id}`}
              onClick={() => this.props.handler(mediaType, data[index].id)}
            >
              <div id="caption"><strong>{data[index].title || data[index].name}</strong></div>
            </Link>}
          <button onClick={event => this.changeSlide(event)} className="btn" id="prev">&#10094;</button>
          <button onClick={event => this.changeSlide(event)} className="btn" id="next">&#10095;</button>
        </div>
        <div className="mx-auto" id="dot-container">
          {data.map((dot, index) => (
            <span
              key={index}
              id={`${type}${index}`}
              onClick={event => this.goToSlide(type, event)}
              className={`dot ${index === this.state.index ? 'activeDot' : 'inactiveDot'}`}
            ></span>
          ))}
        </div>
      </div>
    )
  }
}

export default Carousel

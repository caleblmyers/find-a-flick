import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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

  changeSlide = (type, e) => {
    let { index } = this.state
    e.target.id === "next" ? index++ : index--
    if (index >= this.props.data.length) index = 0
    else if (index <= -1) index = this.props.data.length - 1
    this.setState({ index })
  }

  goToSlide = (type, e) => this.setState({ index: e.target.id.slice(type.length) })

  render() {
    let mediaType
    if (this.props.type === "movie" || this.props.type === "topMovie") mediaType = "movie"
    else if (this.props.type === "show" || this.props.type === "topShow") mediaType = "tv"
    else mediaType = this.props.type

    return (
      <div className="Carousel">
        <div className="mx-auto div-featured">
          <img className="img-fluid" id="img-featured" src={`https://image.tmdb.org/t/p/original/${this.state.data[this.state.index].backdrop_path}`} alt="..." />
          <Link onClick={() => this.props.handler(mediaType, this.state.data[this.state.index].id)} to={{
            pathname: '/details',
            state: {
              type: mediaType,
              id: this.state.data[this.state.index].id
            }
          }}>
            <div id="caption"><strong>{this.state.data[this.state.index].title || this.state.data[this.state.index].name}</strong></div>
          </Link>
          <button onClick={event => this.changeSlide(this.props.type, event)} className="btn" id="prev">&#10094;</button>
          <button onClick={event => this.changeSlide(this.props.type, event)} className="btn" id="next">&#10095;</button>
        </div>
        <div className="mx-auto" id="dot-container">
          {this.state.data.map((feature, index) => (
            <span
              key={index}
              id={`${this.props.type}${index}`}
              onClick={event => this.goToSlide(this.props.type, event)}
              className={`dot ${index === this.state.index ? 'activeDot' : 'inactiveDot'}`}
            ></span>
          ))}
        </div>
      </div>
    )
  }
}

export default Carousel

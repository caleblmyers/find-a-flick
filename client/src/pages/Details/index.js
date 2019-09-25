import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import { getDetails } from '../../store/actions/searchActions'

import './style.css'

class Details extends Component {
  state = {
    isLoaded: false
  }

  componentDidMount() {
    this.props.getDetails(this.props.location.state.id)
    setTimeout(() => this.setState({ isLoaded: true }), 1500)
  }

  render() {
    const { details } = this.props

    return (
      <div className="Details p-4">
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
            <div className="row no-gutters">
              <div className="col-3">
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/original/${details.poster_path}`} alt="Poster" />
              </div>
              <div className="col-9 px-3">
                <div className="row no-gutters">
                  <div className="col">
                    <div className="h2">{details.original_title}</div>
                  </div>
                </div>
                {details.tagline &&
                  <div className="row no-gutters">
                    <div className="col">
                      <small className="text-muted">{details.tagline}</small>
                    </div>
                  </div>}
                <div className="row no-gutters">
                  <div className="col">
                    <div>
                      {moment(details.release_date, "YYYY-MM-DD").format("MMMM Do, YYYY")},
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      Genres:
                      <div>
                        {details.genres.map(genre => (
                          <span key={genre.id}>{genre.name} </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div>
                      Runtime: {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
                    </div>
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-4">
                    Rating: {details.vote_average} <small>({details.vote_count})</small>
                  </div>
                  <div className="col-8">
                    {details.overview}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

Details.propTypes = {
  getDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  details: state.search.details
})

export default connect(mapStateToProps, { getDetails })(Details)
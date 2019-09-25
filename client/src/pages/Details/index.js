import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import { getDetails } from '../../store/actions/searchActions'

import './style.css'
import AuthContext from '../../contexts/AuthContext'
import API from '../../lib/API'

class Details extends Component {
  static contextType = AuthContext

  state = {
    isLoaded: false,
    message: "",
    messageType: ""
  }

  componentDidMount() {
    this.props.getDetails(this.props.location.state.type, this.props.location.state.id)
    setTimeout(() => this.setState({ isLoaded: true }), 1500)
  }

  addFavorite = (type, id, title, userId, token) => {
    API.Favorites.add(type, id, title, userId, token)
      .then(res => {
        let message = ""
        let messageType = ""
        if (res.data.errors) {
          message = res.data.errors[0].type === "unique violation" ? "This item is already on your favorites!" : "Unknown error"
          messageType = "danger"
        } else {
          message = `${res.data.title} added to favorites!`
          messageType = "success"
        }
        this.setState({ message, messageType })
        console.log(res)

      })
      .catch(err => console.log(err))
  }

  render() {
    const { details } = this.props
    const { user } = this.context

    return (
      <div className="Details p-4">
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
            <div>
              {this.state.message &&
                <div className='row no-gutters'>
                  <div className='col'>
                    <div className={`alert alert-${this.state.messageType} mb-3`} role='alert'>
                      {this.state.message}
                    </div>
                  </div>
                </div>}
              <div className="row no-gutters p-3" id="details-body">
                <div className="col-9 px-3">
                  <div className="p-3" id="details-header">
                    <div className="row no-gutters">
                      <div className="col">
                        <div className="h2">{details.title || details.name}</div>
                      </div>
                    </div>
                    {details.tagline &&
                      <div className="row no-gutters">
                        <div className="col">
                          <small>{details.tagline}</small>
                        </div>
                      </div>}
                    <div className="row no-gutters">
                      <div className="col">
                        <div>
                          Released:
                        {moment((
                            details.release_date || details.first_air_date
                          ), "YYYY-MM-DD").format("MMMM Do, YYYY")}
                        </div>
                      </div>
                      <div className="col">
                        <div>
                          Genres:
                        </div>
                        <div>
                          {details.genres.map(genre => (
                            <span key={genre.id}>{genre.name} </span>
                          ))}
                        </div>
                      </div>
                      {this.props.location.state.type === "movie" &&
                        <div className="col">
                          <div>
                            Runtime: {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
                          </div>
                        </div>}
                    </div>
                  </div>

                  <div className="row no-gutters my-4">
                    <div className="col-8">
                      <div className="h5">Overview</div>
                      <p>{details.overview}</p>
                    </div>
                    <div className="col-4">
                      <div>
                        Rating: {details.vote_average} <small>({details.vote_count})</small>
                      </div>
                      {user && <div>
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => this.addFavorite(
                            this.props.location.state.type,
                            this.props.location.state.id,
                            (details.title || details.name),
                            this.context.user.id,
                            this.context.authToken
                          )}>Favorite</button>
                      </div>}
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <img className="img-fluid rounded" src={`https://image.tmdb.org/t/p/original/${details.poster_path}`} alt="Poster" />
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
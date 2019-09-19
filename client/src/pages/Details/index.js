import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getDetails } from '../../store/actions/searchActions'

class Details extends Component {
  componentDidMount() {
    this.props.getDetails(this.props.location.state.id)
  }

  render() {
    console.log(this.props.details)
    const { details } = this.props

    return (
      <div className="Details p-4">
        {!this.props.details ? (
          <div>Loading...</div>
        ) : (
            <div className="row no-gutters">
              <div className="col-3">
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/original/${details.poster_path}`} alt="Poster" />
              </div>
              <div className="col-9 px-3">
                <div className="row no-gutters bg-dark text-white">
                  <div className="col">
                    <div className="h1">{details.original_title}</div>
                  </div>
                </div>
                <div className="row no-gutters">
                  More Details
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
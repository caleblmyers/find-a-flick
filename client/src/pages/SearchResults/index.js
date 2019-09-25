import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import { processSearch } from '../../store/actions/searchActions'

import './style.css'

class SearchResults extends Component {
  componentDidMount() {
    this.props.processSearch(this.props.location.state.keyword)
  }

  render() {
    let resultItems = this.props.results.results ?
      this.props.results.results.map(result => (
        <div className="col-12 col-md-6 col-xl-3 p-3" key={result.id}>
          <div className="card mb-3">
            <div className="row no-gutters">
              <div className="col-12 col-md-5">
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} alt="..." />
              </div>
              <div className="col-12 col-md-7">
                <div className="card-body">
                  <h5 className="card-title">{result.title || result.name}</h5>
                  <h6 className="card-subtitle text-muted capitalize">{result.media_type}</h6>
                  <h6 className="card-subtitle text-muted">
                    Release Date:
                    {moment((
                      result.release_date || result.first_air_date
                    ), "YYYY-MM-DD").format("MM/DD/YYYY")}
                  </h6>
                  <p>Rating: {result.vote_average} <small>({result.vote_count})</small></p>
                  <Link to={{
                    pathname: '/details',
                    state: {
                      type: result.media_type,
                      id: result.id
                    }
                  }}>
                    <button className="btn btn-info">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )) : <div></div>

    return (
      <div className='SearchResults' >
        <div className="display-4">Search Results for <span className="capitalize">{`"${this.props.location.state.keyword}"`}</span></div>
        <div className="row no-gutters justify-content-center">
          {resultItems}
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  processSearch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  results: state.search.results,
  keyword: state.search.keyword
})

export default connect(mapStateToProps, { processSearch })(SearchResults)

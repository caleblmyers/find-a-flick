import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { processSearch } from '../../actions/searchActions'

import './style.css'
import ResultsGrid from '../../components/ResultsGrid'

class SearchResults extends Component {
  componentDidMount() {
    this.props.processSearch()
  }

  truncateText(text, maxLength) {
    let truncated = text
    if (text.length > maxLength) {
      truncated = truncated.substr(0, maxLength) + '...';
    }
    return truncated;
  }

  render() {
    const maxLength = 100

    let resultItems = this.props.results.results ?
      this.props.results.results.map(result => (
        <div className="col-12 col-md-6 col-xl-3 p-3" key={result.id}>
          <div className="card mb-3">
            <div className="row no-gutters">
              <div className="col-4">
                <img className="img-fluid" src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} alt="..." />
              </div>
              <div className="col-8">
                <div className="card-body">
                  <h5 className="card-title">{result.original_title}</h5>
                  <p className="card-text">{this.truncateText(result.overview, maxLength)}</p>
                  <Link to={{
                    pathname: '/details',
                    state: {
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
        <div className="display-4">Search Results</div>
        <ResultsGrid>
          {resultItems}
        </ResultsGrid>
      </div>
    );
  }
}

SearchResults.propTypes = {
  processSearch: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  results: state.search.results
})

export default connect(mapStateToProps, { processSearch })(SearchResults)

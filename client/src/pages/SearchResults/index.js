import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import { processSearch } from '../../store/actions/searchActions'

import './style.css'
import SearchBar from '../../components/SearchBar'
import ResultsGrid from '../../components/ResultsGrid'

class SearchResults extends Component {
  state = {
    keyword: this.props.location.state.keyword,
    results: []
  }

  componentDidMount() {
    this.props.processSearch(this.state.keyword)
    this.setState({ results: this.props.results.results })
  }

  submitHandler = keyword => {
    console.log('handler')
    this.setState({ keyword })
    this.props.processSearch(keyword)
  }

  render() {
    return (
      <div className='SearchResults'>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="display-3">Pop Media</div>
            <div className="lead pt-2">Discover something new!</div>
            <SearchBar handler={() => this.submitHandler(this.props.keyword)} />
          </div>
        </div>
        <div className="display-4">Search Results for <span className="capitalize">{`"${this.props.location.state.keyword}"`}</span></div>
        {this.props.results.results && <ResultsGrid results={this.props.results.results} />}
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

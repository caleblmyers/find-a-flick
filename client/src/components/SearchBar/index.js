import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getSearch } from '../../store/actions/searchActions'

class SearchBar extends Component {
  render() {
    return (
      <div className="SearchBar">
        <form>
          <div className="form-group my-2">
            <label className="m-auto"><strong>Search for a movie, show, or person</strong></label>
            <div className="input-group justify-content-center my-2">
              <input
                value={this.props.search}
                onChange={this.props.getSearch}
                type="text"
                placeholder="Search here..."
                className="form-control"
              />
              {this.props.keyword ? (
                <Link onClick={() => this.props.handler(this.props.keyword)} to={{
                  pathname: "/results",
                  state: {
                    keyword: this.props.keyword
                  }
                }}>
                  <button className="btn btn-outline-secondary" type="submit">
                    <span>Search</span>
                  </button>
                </Link>
              ) : (
                  <button className="btn btn-outline-secondary" type="submit">
                    <span>Search</span>
                  </button>
                )}
            </div>
          </div>
        </form>
      </div>
    )
  }
}

SearchBar.propTypes = {
  keyword: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  keyword: state.search.keyword
})

export default connect(mapStateToProps, { getSearch })(SearchBar)
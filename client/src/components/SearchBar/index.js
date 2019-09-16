import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getSearch } from '../../actions/searchActions'

class SearchBar extends Component {
  // state = {
  //   search: ""
  // }

  // handleInputChange = event => {
  //   let value = event.target.value
  //   const name = event.target.name

  //   this.setState({ [name]: value })
  // }

  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    return (
      <div className="SearchBar">
        <form>
          <span className="h6 mx-1">Search for a movie, show, or person</span>
          <input
            value={this.props.search}
            onChange={this.props.getSearch}
            type="text"
            placeholder="Search here..."
            className="mx-2"
          />
          <button className="mx-2 btn btn-info" onSubmit={this.handleSubmit} type="submit">
            {this.props.keyword ? (
              <Link to={"/results"}>
                <span>Search</span>
              </Link>
            ) : (
                <span>Search</span>
              )}
          </button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  keyword: state.search.keyword
})

export default connect(mapStateToProps, { getSearch })(SearchBar)
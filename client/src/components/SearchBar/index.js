import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import API from '../../lib/API'

class SearchBar extends Component {
  state = {
    search: ""
  }

  handleInputChange = event => {
    let value = event.target.value
    const name = event.target.name

    if (name === "password") value = value.substring(0, 15)
    this.setState({ [name]: value })
  }

  handleRequest = event => {
    event.preventDefault()
  }

  render() {
    return (
      <form className="form">
        <div className="form-group">
          <span className="h6 mx-1">Search for a movie, show, or person</span>
          <input
            value={this.state.search}
            name="search"
            onChange={this.handleInputChange}
            type="text"
            placeholder="Search here..."
            id="search"
            className="mx-2"
          />
          <button
            onClick={this.handleRequest}
            className="mx-2 btn btn-info"
          >
            {this.state.search ? (
              <Link to={{
                pathname: "/results",
                state: this.state.search
              }}>
                <span>Search</span>
              </Link>
            ) : (
                <span>Search</span>
              )}
          </button>
        </div>
      </form>
    )
  }
}

export default SearchBar
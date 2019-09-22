import React, { Component } from 'react'

import './style.css'
import SearchBar from '../SearchBar'

class SideNav extends Component {
  render() {
    return (
      <div className="SideNav text-white">
        <div className="row no-gutters">
          <div className="col">
            <SearchBar />
        </div>
        </div>
      </div>
    )
  }
}

export default SideNav
import React, { Component } from 'react'

class ResultsGrid extends Component {
  render() {
    return (
      <div className="ResultsGrid">
        <div className="row no-gutters justify-content-center">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ResultsGrid
import React from 'react'

import './style.css'

const Loader = () => {
  return (
    <div className="align-center" id="loader">
      <div className="bounce-loader mt-4">
        <span className="nav-bg"></span>
        <span className="bg-light-green"></span>
        <span className="nav-bg"></span>
      </div>
    </div>
  )
}

export default Loader

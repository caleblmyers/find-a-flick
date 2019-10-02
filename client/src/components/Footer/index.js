import React from 'react'

import './style.css'
import LogoTmdb from '../../img/tmdb.png'

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="container text-white" id="footer-row">
        <div className="row h-100">
          <div className="col-4 h-100 ml-auto">
            <div>&copy; 2019 Caleb Myers</div>
          </div>
          <div className="col-4 h-100 mr-auto">
            <img className="img-fluid" id="tmdb-logo" src={LogoTmdb} alt="TMDB" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

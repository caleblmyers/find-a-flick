import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.css'
import AuthContext from '../../contexts/AuthContext'
import AuthDropdown from '../../components/AuthDropdown'
import Popcorn from '../../img/popcorn.ico'

class Navigation extends Component {
  static contextType = AuthContext

  state = { collapsed: true }

  toggleCollapse = () => this.setState({ collapsed: !this.state.collapsed })

  render() {
    const { user } = this.context
    const { collapsed } = this.state
    const togglerClass = `navbar-toggler ${collapsed && 'collapsed'}`
    const targetClass = `collapse navbar-collapse ${!collapsed && 'show'}`

    return (
      <div className='Navigation sticky-top bg-navy'>
        <nav className='navbar navbar-dark navbar-expand-lg'>
          <img className="brand-img" src={Popcorn} alt="Pop Media"/>
          <Link className='navbar-brand' to='/'>Pop Media</Link>
          <button className={togglerClass} onClick={this.toggleCollapse} data-toggle='collapse' data-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className={targetClass} id='navbarSupportedContent'>
            <ul className='navbar-nav mr-auto'>
              <li className='nav-item'>
                <Link className='nav-link' to='/' onClick={this.toggleCollapse}>Home</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/discover' onClick={this.toggleCollapse}>Discover</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/results' onClick={this.toggleCollapse}>Search</Link>
              </li>
              {user &&
                <li className='nav-item'>
                  <Link className='nav-link' to='/account' onClick={this.toggleCollapse}>Account</Link>
                </li>}
            </ul>
            <ul className="navbar-nav ml-auto">
              {user
                ? <AuthDropdown onClick={this.toggleCollapse} />
                : <>
                  <li className='nav-item'><Link className='nav-link' to='/login' onClick={this.toggleCollapse}>Login</Link></li>
                  <li className='nav-item'><Link className='nav-link' to='/register' onClick={this.toggleCollapse}>Register</Link></li>
                </>}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navigation

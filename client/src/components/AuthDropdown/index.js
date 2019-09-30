import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Gravatar from 'react-gravatar';

import AuthContext from '../../contexts/AuthContext';

class AuthDropdown extends Component {
  static contextType = AuthContext;

  state = {
    isOpen: false
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen })

  handleLogout = () => {
    this.context.onLogout();
    this.props.onClick();
  }

  render() {
    const { user } = this.context;
    const { isOpen } = this.state;

    const dropdownMenuClass = `dropdown-menu dropdown-menu-right ${isOpen && 'show'}`;

    return (
      <li className="nav-item dropdown">
        <button className="btn btn-link dropdown-toggle no-link" onClick={this.toggleOpen} id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <Gravatar className="rounded-circle" email={user.username} size={30} /> {user.username}
        </button>
        <div className={dropdownMenuClass} aria-labelledby="navbarDropdown">
          <Link onClick={this.props.onClick} className="dropdown-item" to="/account">
            <div>Account</div>
          </Link>
          <div className="dropdown-item pointer" onClick={this.handleLogout}>Logout</div>
        </div>
      </li>
    );
  }
}

export default AuthDropdown;

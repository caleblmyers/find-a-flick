import React, { Component } from 'react';

import Octicon, { Person, Key } from '@githubprimer/octicons-react';

class LoginForm extends Component {
  state = {
    username: '',
    password: ''
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = event => {
    const { username, password } = this.state;
    this.props.onSubmit(username, password);
    event.preventDefault();
  }

  render() {
    const { username, password } = this.state;

    return (
      <div className='LoginForm'>
        <form className='LoginForm' onSubmit={this.handleSubmit}>
          <div className='input-group mb-3'>
            <div className="input-group-prepend">
              <span className="input-group-text"><Octicon icon={Person} /></span>
            </div>
            <input
              className='form-control'
              id='username'
              type='username'
              name='username'
              placeholder='MovieBuff25'
              value={username}
              onChange={this.handleInputChange}
            />
          </div>
          <div className='input-group mb-3'>
            <div className="input-group-prepend">
              <span className="input-group-text"><Octicon icon={Key} /></span>
            </div>
            <input
              className='form-control'
              id='password'
              type='password'
              name='password'
              placeholder='password'
              value={password}
              onChange={this.handleInputChange}
            />
          </div>
          <button className='btn btn-primary' type='submit'>Login</button>
        </form>
      </div>
    )
  }
}

export default LoginForm;


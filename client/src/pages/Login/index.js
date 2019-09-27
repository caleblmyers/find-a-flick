import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import API from '../../lib/API';
import AuthContext from '../../contexts/AuthContext';
import LoginForm from '../../components/LoginForm';

class Login extends Component {
  static contextType = AuthContext;

  state = {
    redirectToReferrer: false,
    error: ""
  }

  handleSubmit = (username, password) => {
    API.Users.login(username, password)
      .then(response => response.data)
      .then(({ user, token }) => {
        this.context.onLogin(user, token);
        this.setState({ redirectToReferrer: true, error: "" });
      })
      .catch(err => {
        let message;

        switch (err.response.status) {
          case 401:
            message = 'Sorry, that username/password combination is not valid. Please try again.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = 'Unknown error.';
        }

        this.setState({ error: message });
      });
  }

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to="/" />

    return (
      <div className='Login'>
        <div className='row no-gutters'>
          <div className='col'>
            <h1>Login</h1>
          </div>
        </div>
        {this.state.error &&
          <div className='row no-gutters'>
            <div className='col'>
              <div className='alert alert-danger mb-3' role='alert'>
                {this.state.error}
              </div>
            </div>
          </div>}
        <div className='row no-gutters'>
          <div className='col'>
            <LoginForm onSubmit={this.handleSubmit} />
            <div className='mt-3'>Don't have an account? <Link to='/register'>Click here to register.</Link></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import API from '../../lib/API';
import AuthContext from '../../contexts/AuthContext';
import LoginForm from '../../components/LoginForm';

class Login extends Component {
  static contextType = AuthContext;

  state = {
    redirectToReferrer: false,
    error: "",
    created: "",
    deleted: ""
  }

  componentDidMount() {
    const { from } = this.props.location.state || "Unknown"
    const { newUser } = this.props.location.state || false
    if (from && from.pathname === "/account") this.setState({ deleted: "Your account has been deleted" })
    else if (newUser) this.setState({ created: "Account created successfully!" })
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

        this.setState({
          error: message,
          deleted: "",
          created: ""
        });
      });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } }
    const { created, deleted, error, redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <div className='Login container'>
        <div className='row mb-3'>
          <div className='col'>
            <h1>Login</h1>
          </div>
        </div>
        {created &&
          <div className='row'>
            <div className='col'>
              <div className='alert alert-success mb-3' role='alert'>
                {created}
              </div>
            </div>
          </div>}
        {deleted &&
          <div className='row'>
            <div className='col'>
              <div className='alert alert-info mb-3' role='alert'>
                {deleted}
              </div>
            </div>
          </div>}
        {error &&
          <div className='row'>
            <div className='col'>
              <div className='alert alert-danger mb-3' role='alert'>
                {error}
              </div>
            </div>
          </div>}
        <div className='row mt-3'>
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

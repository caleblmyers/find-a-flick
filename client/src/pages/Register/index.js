import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import API from '../../lib/API'
import AuthContext from '../../contexts/AuthContext'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'

class Register extends Component {
  static contextType = AuthContext

  state = {
    redirectToReferrer: false,
    error: ""
  }

  handleSubmit = (username, email, password, confirm) => {
    if (password === confirm) {
      API.Users.register(username, email, password)
        .then(response => {
          this.setState({ redirectToReferrer: true })
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.setState({ error: "Sorry, that username and/or email is in use. Please try again." })
          } else {
            console.log(err)
          }
        })
    } else {
      this.setState({ error: "Please enter the same password in both fields." })
    }
  }

  render() {
    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      return <Redirect to={{
        pathname: "/login",
        state: {
          newUser: true
        }
      }} />
    }

    return (
      <div className='Register container'>
        <div className='row mb-3'>
          <div className='col'>
            <h1>Register Account</h1>
          </div>
        </div>
        {this.state.error &&
          <div className='row'>
            <div className='col'>
              <div className='alert alert-danger mb-3' role='alert'>
                {this.state.error}
              </div>
            </div>
          </div>}
        <div className='row mt-3'>
          <div className='col'>
            <RegistrationForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

export default Register

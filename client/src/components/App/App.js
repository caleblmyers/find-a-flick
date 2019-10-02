import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import './App.css'
import API from '../../lib/API'
import store from '../../store'
import TokenStore from '../../lib/TokenStore'
import AuthContext from '../../contexts/AuthContext'
import Navigation from '../Navigation'
import PrivateRoute from '../PrivateRoute'
import Home from '../../pages/Home'
import SearchResults from '../../pages/SearchResults'
import Discover from '../../pages/Discover'
import Details from '../../pages/Details'
import Account from '../../pages/Account'
import Login from '../../pages/Login'
import Register from '../../pages/Register'
import NotFound from '../../pages/NotFound'
import Footer from '../Footer'

class App extends Component {
  constructor(props) {
    super(props)

    this.handleLogin = (user, authToken) => {
      TokenStore.setToken(authToken)
      this.setState(prevState => ({ auth: { ...prevState.auth, user, authToken } }))
    }
    this.handleLogout = () => {
      TokenStore.clearToken()
      this.setState(prevState => ({ auth: { ...prevState.auth, user: undefined, authToken: undefined } }))
    }
    this.handleUpdate = user => this.setState(prevState => ({ auth: { ...prevState.auth, user } }))

    this.state = {
      auth: {
        user: undefined,
        authToken: TokenStore.getToken(),
        onLogin: this.handleLogin,
        onLogout: this.handleLogout,
        onUpdate: this.handleUpdate
      }
    }
  }

  componentDidMount() {
    const { authToken } = this.state.auth
    if (!authToken) return

    API.Users.getMe(authToken)
      .then(response => response.data)
      .then(user => this.setState(prevState => ({ auth: { ...prevState.auth, user } })))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.auth}>
        <Provider store={store}>
          <div className='App bg-popcorn text-roboto-sm position-relative'>
            <Navigation />
            {/* <SideNav /> */}
            <div className="bg-popcorn" id="app-body">
              <Switch className="mb-5">
                <Route exact path='/' component={Home} />
                <Route path='/discover' component={Discover} />
                <Route path='/results' component={SearchResults} />
                <Route path='/details/:type/:id' component={Details} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <PrivateRoute path='/account' component={Account} />
                <Route component={NotFound} />
              </Switch>
              <Footer />
            </div>
          </div>
        </Provider>
      </AuthContext.Provider>
    )
  }
}

export default App

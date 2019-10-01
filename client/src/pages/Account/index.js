import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import moment from 'moment'

import API from '../../lib/API'
import AuthContext from '../../contexts/AuthContext'

class Account extends Component {
  static contextType = AuthContext

  state = {
    user: {},
    movies: [],
    shows: [],
    people: [],
    favorites: [],
    comments: [],
    isLoading: true,
    isEditing: false,
    editStart: "",
    editValue: "",
    username: "",
    password: ""
  }

  componentDidMount() {
    const { authToken } = this.context

    if (!authToken) return

    API.Users.getMe(authToken)
      .then(res => res.data)
      .then(user => {
        API.Users.getFavorites(user.id, authToken)
          .then(res => res.data)
          .then(favorites => {
            API.Comments.userComments(user.id, authToken)
              .then(res => res.data)
              .then(comments => {
                console.log(comments)
                console.log(favorites)
                let movies = favorites.filter(fav => fav.mediaType === "movie")
                let shows = favorites.filter(fav => fav.mediaType === "tv")
                let people = favorites.filter(fav => fav.mediaType === "person")
                this.setState({
                  user,
                  movies,
                  shows,
                  people,
                  favorites,
                  comments,
                  isLoading: false
                })
              })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  changeInfo = e => {
    const { user } = this.context

    this.setState({
      username: "",
      password: "",
      isEditing: e.target.name,
      editStart: user[e.target.name]
    })
  }

  submitInfo = e => {
    const { user, authToken } = this.context

    const { isEditing } = this.state

    API.Users.update(isEditing, this.state[isEditing], user.id, authToken)
      .then(update => {
        API.Users.getMe(authToken)
          .then(res => res.data)
          .then(user => {
            console.log(user)
            this.setState({
              user,
              isEditing: false
            })
            this.context.onUpdate(user)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  deleteAccount = () => {
    const { user, authToken } = this.context

    API.Users.delete(user.id, authToken)
      .then(res => this.context.onLogout())
      .catch(err => console.log(err))
  }

  render() {
    const { user, movies, shows, people, comments, favorites, isLoading, isEditing, editStart, editValue } = this.state

    return (
      <div>
        <h1>Account</h1>
        {isLoading ? (
          <div>
            Loading...
          </div>
        ) : (
            <div className="container">
              <div className="row mb-2">
                <div className="col">
                  <div>
                    <Gravatar className="rounded-circle" email={user.username} size={100} />
                  </div>
                  <div>
                    <h1>Hi there, {user.username}</h1>
                    <h4>Created: {moment(user.createdAt).format("MMMM Do, YYYY")}</h4>
                    <h4>Updated: {moment(user.updatedAt).format("MMMM Do, YYYY")}</h4>
                    <h6>Number of Favorites: {favorites.length}</h6>
                    <h6>Number of Comments: {comments.length}</h6>
                  </div>
                </div>
              </div>
              <h4>Settings</h4>
              <div className="row mb-4">
                {isEditing && <div className="col-12">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      onChange={this.handleChange}
                      name={isEditing}
                      value={this.state[isEditing]}
                      className="form-control"
                      placeholder={editStart} />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
                        onClick={this.submitInfo}
                      >Submit</button>
                    </div>
                  </div>
                </div>}
                <div className="col-4">
                  <button
                    className="btn btn-success"
                    onClick={this.changeInfo}
                    name="username"
                  >Change Username</button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-info"
                    onClick={this.changeInfo}
                    name="password"
                  >Change Password</button>
                </div>
                <div className="col-4">
                  <button
                    className="btn btn-danger"
                    onClick={this.deleteAccount}
                  >Delete Account</button>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <h4>Movies</h4>
                  {movies.map(movie => (
                    <div className="col" key={movie.id}>
                      <div>{movie.title}</div>
                      <Link to={{
                        pathname: '/details',
                        state: {
                          type: movie.mediaType,
                          id: movie.tmdbId
                        }
                      }}>
                        <button className="btn btn-info">
                          Details
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="col-4">
                  <h4>Shows</h4>
                  {shows.map(show => (
                    <div className="col" key={show.id}>
                      <div>{show.title}</div>
                    </div>
                  ))}
                </div>
                <div className="col-4">
                  <h4>People</h4>
                  {people.map(person => (
                    <div className="col" key={person.id}>
                      <div>{person.title}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <h4>Comments</h4>
                  {comments.map(comment => (
                    <div className="col" key={comment.id}>
                      <div>{comment.body}</div>
                    </div>
                  ))}
                </div>
                <div className="col-4">
                  <h4>Settings</h4>

                </div>
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default Account

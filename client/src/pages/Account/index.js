import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Gravatar from 'react-gravatar'
import moment from 'moment'

import API from '../../lib/API'
import AuthContext from '../../contexts/AuthContext'
import Loader from '../../components/Loader'

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
    password: "",
    message: "",
    messageType: ""
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

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  changeInfo = e => {
    if (this.state.isEditing) return this.setState({ isEditing: false })

    const { user } = this.context
    this.setState({
      username: "",
      password: "",
      isEditing: e.target.name,
      editStart: user[e.target.name],
      message: "",
      messageType: ""
    })
  }

  submitInfo = e => {
    e.preventDefault()
    const { user, authToken } = this.context
    const { isEditing } = this.state

    if (this.state[isEditing] === "") {
      return this.setState({
        message: "Entries cannot be blank.",
        messageType: "danger",
        isEditing: false
      })
    }

    API.Users.update(isEditing, this.state[isEditing], user.id, authToken)
      .then(update => {
        console.log(update)
        if (update.data.errors) {
          this.setState({
            message: "Username already taken. Try something else.",
            messageType: "danger",
            isEditing: false
          })
        } else {
          API.Users.getMe(authToken)
            .then(res => res.data)
            .then(user => {
              console.log(user)
              this.setState({
                user,
                isEditing: false,
                message: "Account update successful!",
                messageType: "success"
              })
              this.context.onUpdate(user)
            })
            .catch(err => console.log(err))
        }
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
    const { user, movies, shows, people, comments, favorites, isLoading, isEditing, editStart, message, messageType } = this.state

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
            <div className="container pt-5">
              <div className="row mb-2">
                <div className="col-12">
                  <div>
                    <Gravatar className="rounded-circle" email={user.username} size={100} />
                    <h1>Hi there, {user.username}</h1>
                  </div>
                </div>
              </div>
              {message &&
                <div className='row'>
                  <div className='col'>
                    <div className={`alert alert-${messageType} mb-3`} role='alert'>
                      {message}
                    </div>
                  </div>
                </div>}
              <div className="row mb-3">
                <div className="col-12 col-md-6 my-auto">
                  <h5>Created: {moment(user.createdAt).format("MMMM Do, YYYY")}</h5>
                  <h5>Updated: {moment(user.updatedAt).format("MMMM Do, YYYY")}</h5>
                  <h6>Number of Favorites: {favorites.length}</h6>
                  <h6>Number of Comments: {comments.length}</h6>
                </div>

                <div className="col-12 col-md-6">
                  <div className="row">
                    <div className="col-12 mt-3">
                      <h4>Settings</h4>
                      {isEditing && <div className="col-12">
                        <form onSubmit={this.submitInfo}>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              onChange={this.handleChange}
                              name={isEditing}
                              value={this.state[isEditing]}
                              className="form-control"
                              placeholder={isEditing === "password" ? editStart.replace(/./g, '*') : editStart} />
                            <div className="input-group-append">
                              <button
                                type="submit"
                                id="button-addon2"
                                className="btn btn-outline-secondary"
                              >Submit</button>
                            </div>
                          </div>
                        </form>
                      </div>}
                      <div className="row my-3">
                        <div className="col-12">
                          <button
                            className="btn btn-success"
                            onClick={this.changeInfo}
                            name="username"
                          >Change Username</button>
                        </div>
                      </div>
                      {/* <div className="row my-3">
                        <div className="col-12">
                          <button
                            className="btn btn-info"
                            onClick={this.changeInfo}
                            name="password"
                          >Change Password</button>
                        </div>
                      </div> */}
                      <div className="row my-3">
                        <div className="col-12">
                          <button
                            className="btn btn-danger"
                            onClick={this.deleteAccount}
                          >Delete Account</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h2 mt-2">Favorites</div>
              {movies[0] && <h4 className="text-left my-2">Movies</h4>}
              <div className="row">
                {movies.map(movie => (
                  <div className="col-6 col-lg-3" key={movie.id}>
                    <div className="card border-secondary rounded bg-light-grey mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{movie.title}</h6>
                        {/* <p className="mb-0">Added:</p>
                        <p>{moment(movie.createdAt).format("MM/DD/YYYY -- hh:mm a")}</p> */}
                        <Link to={`/details/${movie.mediaType}/${movie.tmdbId}`}>
                          <button className="btn btn-outline-dark">
                            Details
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {shows[0] && <h4 className="text-left my-2">Shows</h4>}
              <div className="row">
                {shows.map(show => (
                  <div className="col-6 col-lg-3" key={show.id}>
                    <div className="card border-secondary rounded bg-light-grey mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{show.title}</h6>
                        {/* <p className="mb-0">Added:</p>
                        <p>{moment(show.createdAt).format("MM/DD/YYYY -- hh:mm a")}</p> */}
                        <Link to={`/details/${show.mediaType}/${show.tmdbId}`}>
                          <button className="btn btn-outline-dark">
                            Details
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {people[0] && <h4 className="text-left my-2">People</h4>}
              <div className="row">
                {people.map(person => (
                  <div className="col-6 col-lg-3" key={person.id}>
                    <div className="card border-secondary rounded bg-light-grey mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{person.title}</h6>
                        {/* <p className="mb-0">Added:</p>
                        <p>{moment(person.createdAt).format("MM/DD/YYYY -- hh:mm a")}</p> */}
                        <Link to={`/details/${person.mediaType}/${person.tmdbId}`}>
                          <button className="btn btn-outline-dark">
                            Details
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {comments[0] && <h4 className="text-left my-2">Comments</h4>}
              <div className="row">
                {comments.map(comment => (
                  <div className="col-6 col-lg-3" key={comment.id}>
                    <div className="card border-secondary rounded bg-light-grey mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{comment.body}</h6>
                        {/* <p className="mb-0">Added:</p>
                        <p>{moment(comment.createdAt).format("MM/DD/YYYY -- hh:mm a")}</p>
                        {(comment.createdAt !== comment.updatedAt) && <div>
                          <p className="mb-0">Updated:</p>
                          <p>{moment(comment.updatedAt).format("MM/DD/YYYY -- hh:mm a")}</p>
                        </div>} */}
                        <Link to={`/details/${comment.mediaType}/${comment.tmdbId}`}>
                          <button className="btn btn-outline-dark">
                            Go to Page
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    )
  }
}

export default Account

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import Gravatar from 'react-gravatar';
import PropTypes from 'prop-types'
import { getDetails } from '../../store/actions/searchActions'

import './style.css'
import AuthContext from '../../contexts/AuthContext'
import API from '../../lib/API'
import CastSlider from '../../components/CastSlider'
import Carousel from '../../components/Carousel'

class Details extends Component {
  static contextType = AuthContext

  state = {
    isLoaded: false,
    isEditing: "",
    edit: "",
    message: "",
    messageType: "",
    comment: "",
    comments: [],
    details: {},
    credits: {},
    combined_credits: {}
  }

  componentDidMount() {
    const { type, id } = this.props.match.params

    this.props.getDetails(type, id)

    API.Comments.pageComments(type, id)
      .then(res => {
        const comments = res.data
        this.setState({ comments })
      })
      .catch(err => console.log(err))

    setTimeout(() => this.setState({
      details: this.props.details,
      credits: this.props.details.credits,
      combined_credits: this.props.details.combined_credits,
      isLoaded: true
    }), 3500)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.location !== this.props.location) {
      console.log('diff type')
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      this.setState({ isLoaded: false })
      if (this.props.history.action === "POP") {
        this.changeMedia(nextProps.match.params.type, nextProps.match.params.id)
      }
      return false
    }
    else if (this.props.match.params.type === "movie" && !this.state.details.revenue) {
      console.log('movie wait')
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      return true
    }
    else if (this.props.match.params.type === "movie" && this.state.details.revenue) {
      console.log('movie update')
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      return true
    }
    else {
      console.log('updating')
      console.log(this.props.details)
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      return true
    }
  }

  addFavorite = (type, id, title, userId, token) => {
    API.Favorites.add(type, id, title, userId, token)
      .then(res => {
        let message = ""
        let messageType = ""
        if (res.data.errors) {
          message = res.data.errors[0].type === "unique violation" ? "This item is already on your favorites!" : "Unknown error"
          messageType = "danger"
        } else {
          message = `${res.data.title} added to favorites!`
          messageType = "success"
        }
        this.setState({ message, messageType })
      })
      .catch(err => console.log(err))
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { comment } = this.state
    const { user, authToken } = this.context
    const { type, id } = this.props.match.params

    let newComment = {
      userId: user.id,
      userName: user.username,
      mediaType: type,
      tmdbId: id,
      body: comment,
      replyTo: 0
    }

    API.Comments.add(newComment, authToken)
      .then(res => {
        API.Comments.pageComments(type, id)
          .then(res => {
            const comments = res.data
            this.setState({
              comments,
              comment: ""
            })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  changeMedia = (type, id) => {
    console.log('changeMedia', this.props.match.params.id)
    this.setState({ isLoaded: false })
    this.props.getDetails(type, id)
    API.Comments.pageComments(type, id)
      .then(res => {
        const comments = res.data
        setTimeout(() => this.setState({
          comments,
          message: "",
          messageType: "",
          details: this.props.details,
          credits: this.props.details.credits,
          combined_credits: this.props.details.combined_credits,
          isLoaded: true
        }), 4000)
      })
      .catch(err => console.log(err))
  }

  deleteComment = e => {
    console.log(e.target.value)
    const { authToken } = this.context
    const { type, id } = this.props.match.params

    API.Comments.delete(e.target.value, authToken)
      .then(res => {
        API.Comments.pageComments(type, id)
          .then(res => res.data)
          .then(comments => this.setState({ comments }))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  editComment = e => {
    console.log(e.target.value)
    if (this.state.isEditing === "") this.setState({ isEditing: e.target.value })
    else this.setState({ isEditing: "" })
  }

  submitEdit = e => {
    const { isEditing, edit } = this.state
    const { authToken } = this.context
    const { type, id } = this.props.match.params

    if (isEditing) {
      API.Comments.edit(isEditing, edit, authToken)
        .then(res => {
          API.Comments.pageComments(type, id)
            .then(res => res.data)
            .then(comments => this.setState({ comments }))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        .finally(this.setState({ isEditing: "" }))
    }
  }

  render() {
    const { details } = this.props
    const { user, authToken } = this.context
    const { message, messageType, comment, comments, isLoaded, isEditing, edit } = this.state
    const { type, id } = this.props.match.params

    return (
      <div className="Details pb-5">
        {(isLoaded && details.backdrop_path) && <div className="row no-gutters" id="backdrop-row">
          <div className="col-sm-12 d-md-none">
            <img className="img-fluid rounded" src={`https://image.tmdb.org/t/p/original/${details.backdrop_path || details.profile_path}`} alt="Poster" />
          </div>
        </div>}
        {!isLoaded ? (
          <div>Loading...</div>
        ) : (
            <div className="container pt-3">
              {message &&
                <div className='row'>
                  <div className='col'>
                    <div className={`alert alert-${messageType} mb-3`} role='alert'>
                      {message}
                    </div>
                  </div>
                </div>}
              <div className="row bg-light-grey" id="details-body">
                <div className="col-12 col-md-8 py-3">
                  <div className="p-3" id="details-header">
                    <div className="row no-gutters">
                      <div className="col">
                        <div className="h2">{details.title || details.name}</div>
                      </div>
                    </div>
                    {details.tagline &&
                      <div className="row no-gutters">
                        <div className="col">
                          <small>{details.tagline}</small>
                        </div>
                      </div>}
                    {type === "person" ? (
                      <div className="row no-gutters">
                        <div className="col">
                          Birthplace: {details.place_of_birth}
                        </div>
                        <div className="col">
                          Birthday:
                          {moment((
                            details.birthday
                          ), "YYYY-MM-DD").format(" MMMM Do, YYYY")}
                        </div>
                        <div className="col">
                          Known for: {details.known_for_department}
                        </div>
                      </div>
                    ) : (
                        <div className="row no-gutters">
                          <div className="col">
                            <div className="row no-gutters">
                              <div className="col">
                                Released:
                              {moment((
                                  details.release_date || details.first_air_date
                                ), "YYYY-MM-DD").format(" MMMM Do, YYYY")}
                              </div>
                            </div>
                            {details.runtime &&
                              <div className="row no-gutters">
                                <div className="col">
                                  <div>
                                    Runtime: {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
                                  </div>
                                </div>
                              </div>}
                          </div>

                          {details.genres && <div className="col-6">
                            <div>Genres: </div>
                            <div>
                              {details.genres.map((genre, index) => (
                                <span key={genre.id}> {genre.name}{index === details.genres.length - 1 ? "" : ","}</span>
                              ))}
                            </div>
                          </div>}
                        </div>
                      )}
                  </div>

                  <div className="row no-gutters my-4 text-left">
                    <div className="col-12">
                      <div className="h5">Overview</div>
                      <p>{details.overview || details.biography}</p>
                    </div>
                    <div className="col-8">
                      <div className="h5">Featured Crew</div>
                      {type === "tv" &&
                        <div className="row no-gutters">
                          {details.created_by.map(creator => (
                            <div className="col" key={creator.id}>
                              <div><strong>{creator.name}</strong></div>
                              <div>Creator</div>
                            </div>
                          ))}
                        </div>}
                      {type === "movie" &&
                        <div className="row no-gutters">
                          {details.credits.crew.slice(0, 3).map(crew => (
                            <div className="col" key={crew.id}>
                              <div><strong>{crew.name}</strong></div>
                              <div>{crew.job}</div>
                            </div>
                          ))}
                        </div>}
                      {type === "person" &&
                        <div className="row no-gutters">
                          {details.combined_credits && details.combined_credits.crew.slice(0, 3).map(credit => (
                            <div className="col" key={credit.id}>
                              <div><strong>{credit.title || credit.name}</strong></div>
                              <div>{credit.job}</div>
                            </div>
                          ))}
                        </div>}
                    </div>
                    <div className="col-4 text-right">
                      {details.vote_average && <div>
                        Rating: {details.vote_average} <small>({details.vote_count})</small>
                      </div>}
                      {user && <div>
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => this.addFavorite(
                            type,
                            id,
                            (details.title || details.name),
                            user.id,
                            authToken
                          )}>Favorite</button>
                      </div>}
                    </div>
                  </div>
                </div>
                <div className="col-4 py-3 d-none d-md-block">
                  <img className="img-fluid rounded" src={`https://image.tmdb.org/t/p/original/${details.poster_path || details.profile_path}`} alt="Poster" />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-9 p-3 text-left">
                  {type !== "person" ? (
                    <div className="h4"><strong>Cast</strong></div>
                  ) : (
                      <div className="h4"><strong>Credits</strong></div>
                    )}
                  {type !== "person" ? (
                    <div>
                      <CastSlider cast={details.credits.cast} handler={this.changeMedia} />
                    </div>
                  ) : (
                      <div>
                        {details.known_for_department === "Acting" ? (
                          <CastSlider
                            cast={details.combined_credits.cast.slice(0, 30).sort((a, b) => b.vote_count - a.vote_count)}
                            handler={this.changeMedia}
                          />
                        ) : (
                            <CastSlider
                              cast={details.combined_credits.crew.slice(0, 30).sort((a, b) => b.vote_count - a.vote_count)}
                              handler={this.changeMedia}
                            />
                          )}
                      </div>
                    )}
                  {type !== "person" ? (
                    <div className="row mt-3">
                      <div className="col-6">
                        <div className="h4"><strong>Recommended</strong></div>
                        <div className="row bg-light-grey border-round mr-1">
                          <div className="col-12 p-2">
                            {details.recommendations.results.length >= 1 ? (
                              <Carousel data={details.recommendations.results} type={type} handler={this.changeMedia} />
                            ) : (
                                <div className="h6">No recommendations!</div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="h4"><strong>Similar</strong></div>
                        <div className="row bg-light-grey border-round ml-1">
                          <div className="col-12 p-2">
                            {details.similar.results.length >= 1 ? (
                              <Carousel data={details.similar.results} type={type} handler={this.changeMedia} />
                            ) : (
                                <div className="h6">Nothing listed as similar!</div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="row bg-light-grey border-round">
                        <div className="mr-auto col-12 col-md-6 p-3">
                        </div>
                        <div className="mr-auto col-12 col-md-6 p-3">
                        </div>
                      </div>
                    )}
                </div>
                <div className="col-12 col-lg-3 text-left side-col-lg">
                  <div className="h4"><strong>Crew</strong></div>
                  {type === "movie" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.credits.crew.slice(3, 10).map(person => (
                      <div className="col-3 col-lg-12 pl-2 py-1 mr-0" key={person.credit_id}>
                        <div className="text-sm"><strong>{person.name}</strong></div>
                        <div className="text-xs">{person.job}</div>
                      </div>
                    ))}
                    {details.credits.crew.length === 0 && <div>
                      <div className="col-12 px-3 py-2">
                        <div className="h6">Crew unavailable.</div>
                      </div>
                    </div>}
                  </div>}
                  {type === "tv" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.credits.crew.slice(0, 8).map(person => (
                      <div className="col-3 col-lg-12 pl-2 py-1 mr-0" key={person.credit_id}>
                        <div className="text-sm"><strong>{person.name}</strong></div>
                        <div className="text-xs">{person.job}</div>
                      </div>
                    ))}
                  </div>}
                  <div className="h4 mt-2"><strong>Facts</strong></div>
                  {type === "movie" && <div className="row no-gutters bg-light-grey border-round py-2">
                    <div className="col-3 col-lg-12 pl-2 py-1">
                      <div className="text-sm"><strong>Revenue</strong></div>
                      <div className="text-xs">${details.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                    <div className="col-3 col-lg-12 pl-2 py-1">
                      <div className="text-sm"><strong>Budget</strong></div>
                      <div className="text-xs">${details.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                    <div className="col-3 col-lg-12 pl-2 py-1">
                      <div className="text-sm"><strong>Production Companies</strong></div>
                      {details.production_companies.map(company => (
                        <div className="text-xs" key={company.id}>{company.name}</div>
                      ))}
                    </div>
                  </div>}
                  {type === "tv" && <div className="col-12">
                    Tv Facts
                    </div>}
                </div>
              </div>

              <div className="row">
                <div className="col-9">
                  <div className="row no-gutters">
                    <div className="col-12">
                      <div className="h4 text-left">Add a Comment</div>
                      <div className="row bg-light-grey border-round my-3">
                        {user ? (
                          <div className="col-12 p-3">
                            <form onSubmit={this.handleSubmit}>
                              <div className='form-group mb-3'>
                                <textarea
                                  className='form-control'
                                  id='comment'
                                  name='comment'
                                  placeholder='Post a comment'
                                  value={comment}
                                  onChange={this.handleChange}
                                  rows={4}
                                />
                              </div>
                              <div className="form-group mb-3">
                                <button className='btn btn-success float-right' type='submit'>Post</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                            <div className="col-12 p-3">
                              <h4>Log in to comment!</h4>
                            </div>
                          )}
                      </div>

                      <div className="h4 text-left">Comments</div>
                      <div className="row bg-light-grey border-round py-2">
                        {comments[0] ? (
                          comments.map(comment => (
                            <div className="col-12 py-2" key={comment.id}>
                              <div className="card bg-dark text-white text-left">
                                <div className="card-header">
                                  <Gravatar className="rounded-circle" email={comment.userName} size={30} /> {comment.userName}
                                  {(user && user.id === comment.userId) &&
                                    <div className="float-right">
                                      <button
                                        className="btn btn-outline-info mx-2"
                                        onClick={this.editComment}
                                        value={comment.id}
                                      >
                                        Edit
                                        </button>
                                      <button
                                        className="btn btn-outline-danger mx-2"
                                        onClick={this.deleteComment}
                                        value={comment.id}
                                      >
                                        Delete
                                        </button>
                                    </div>}
                                </div>
                                <div className="card-body">
                                  {isEditing === comment.id.toString() ? (
                                    <div>
                                      <div className="input-group mb-3">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder={comment.body}
                                          onChange={this.handleChange}
                                          name="edit"
                                          value={edit}
                                        />
                                        <div className="input-group-append">
                                          <button
                                            className="btn btn-outline-info"
                                            type="button"
                                            id="button-addon2"
                                            onClick={this.submitEdit}
                                          >Submit</button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                      <p>{comment.body}</p>
                                    )}
                                  <blockquote className="blockquote mb-0">
                                    <footer className="blockquote-footer">Created: {moment(comment.createdAt).format("MM/DD/YYYY -- hh:mm a")}</footer>
                                    {(comment.createdAt !== comment.updatedAt) && <div className="blockquote-footer">Updated: {moment(comment.updatedAt).format("MM/DD/YYYY -- hh:mm a")}</div>}
                                  </blockquote>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                            <div className="col-12 py-2">
                              <div className="h4">No comments yet!</div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="h4 text-left">Reviews</div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

Details.propTypes = {
  getDetails: PropTypes.func.isRequired,
  details: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  details: state.search.details
})

export default withRouter(connect(mapStateToProps, { getDetails })(Details))
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
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
    message: "",
    messageType: "",
    comment: "",
    comments: [],
    details: {},
    credits: {},
    combined_credits: {}
  }

  componentDidMount() {
    const { type, id } = this.props.location.state

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
    }), 2500)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      console.log('diff media')
      console.log(this.props)
      console.log(prevProps)
    //   const { type, id } = this.props.location.state
    //   this.setState({ isLoaded: false })

    //   this.props.getDetails(type, id)

    //   API.Comments.pageComments(type, id)
    //     .then(res => {
    //       const comments = res.data
    //       this.setState({ comments })
    //     })
    //     .catch(err => console.log(err))

    //   setTimeout(() => this.setState({
    //     details: this.props.details,
    //     credits: this.props.details.credits,
    //     combined_credits: this.props.details.combined_credits,
    //     isLoaded: true
    //   }), 2500)
    }

    if (this.props.location.key !== prevProps.location.key) {
      console.log('diff key')
      // this.setState({ isLoaded: false })
    }
  }

  componentWillUnmount() {
    this.setState({ isLoaded: false })
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

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const { comment } = this.state
    const { user, authToken } = this.context
    const { type, id } = this.props.location.state

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
        }), 1000)
      })
      .catch(err => console.log(err))
  }

  render() {
    const { details, credits, combined_credits } = this.state
    const { user, authToken } = this.context
    const { message, messageType, comment, comments } = this.state
    const { type, id } = this.props.location.state

    return (
      <div className="Details p-4">
        {!this.state.isLoaded ? (
          <div>Loading...</div>
        ) : (
            <div className="container">
              {message &&
                <div className='row'>
                  <div className='col'>
                    <div className={`alert alert-${messageType} mb-3`} role='alert'>
                      {message}
                    </div>
                  </div>
                </div>}
              <div className="row p-3 bg-light-grey" id="details-body">
                <div className="col-8 px-3">
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
                          Birthday:
                          {moment((
                            details.birthday
                          ), "YYYY-MM-DD").format(" MMMM Do, YYYY")}
                        </div>
                        <div className="col">
                          Birthplace: {details.place_of_birth}
                        </div>
                        <div className="col">
                          Known for: {details.known_for_department}
                        </div>
                      </div>
                    ) : (
                        <div className="row no-gutters">
                          <div className="col">
                            <div>
                              Released:
                              {moment((
                                details.release_date || details.first_air_date
                              ), "YYYY-MM-DD").format(" MMMM Do, YYYY")}
                            </div>
                          </div>
                          {details.genres && <div className="col">
                            <div>
                              Genres:
                              {details.genres.map(genre => (
                                <span key={genre.id}> {genre.name}</span>
                              ))}
                            </div>
                          </div>}
                          {details.runtime &&
                            <div className="col">
                              <div>
                                Runtime: {`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
                              </div>
                            </div>}
                        </div>
                      )}
                  </div>

                  <div className="row no-gutters my-4">
                    <div className="col-8">
                      <div className="h5">Overview</div>
                      <p>{details.overview || details.biography}</p>
                    </div>
                    <div className="col-4">
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
                <div className="col-4">
                  <img className="img-fluid rounded" src={`https://image.tmdb.org/t/p/original/${details.poster_path || details.profile_path}`} alt="Poster" />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-lg-9 p-3 text-left">
                  {type === "person" ? (
                    <div className="h4"><strong>Credits</strong></div>
                  ) : (
                      <div className="h4"><strong>Cast</strong></div>
                    )}
                  <CastSlider cast={credits.cast || combined_credits.cast} handler={this.changeMedia} />
                  <div className="row mt-2">
                    <div className="col-12 col-md-6">
                      <div className="h4"><strong>Recommended</strong></div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="h4"><strong>Similar</strong></div>
                    </div>
                  </div>
                  <div className="row bg-light-grey border-round">
                    <div className="mr-auto col-12 col-md-6 p-3">
                      {type !== "person" && <Carousel data={details.recommendations.results} type={type} handler={this.changeMedia} />}
                    </div>
                    <div className="mr-auto col-12 col-md-6 p-3">
                      {type !== "person" && <Carousel data={details.similar.results} type={type} handler={this.changeMedia} />}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-3 p-3 text-left">
                  <div className="h4"><strong>Crew</strong></div>
                  {type !== "person" && credits.crew && <div className="row no-gutters bg-light-grey border-round py-2">
                    {credits.crew.slice(0, 8).map(person => (
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
                                  onChange={this.handleInputChange}
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
                                <div className="card-header">{comment.userName}</div>
                                <div className="card-body">
                                  <blockquote className="blockquote mb-0">
                                    <p>{comment.body}</p>
                                    <footer className="blockquote-footer">Created at: {comment.createdAt}</footer>
                                  </blockquote>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                            <div className="col-12 py-2">
                              <div className="h1">No comments yet!</div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  Reviews
                </div>
              </div>`
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
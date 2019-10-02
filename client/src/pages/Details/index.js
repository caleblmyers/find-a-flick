import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Gravatar from 'react-gravatar'
import PropTypes from 'prop-types'
import moment from 'moment'
import { getDetails } from '../../store/actions/searchActions'

import './style.css'
import AuthContext from '../../contexts/AuthContext'
import API from '../../lib/API'
import CastSlider from '../../components/CastSlider'
import Carousel from '../../components/Carousel'
import Person from '../../img/person_placeholder.png'
import MediaTall from '../../img/media_placeholder_tall.png'
import EpisodeReel from '../../components/EpisodeReel'
import Loader from '../../components/Loader'

class Details extends Component {
  constructor(props) {
    super(props)

    this.timer = null
  }
  static contextType = AuthContext

  state = {
    isLoaded: false,
    error: "",
    isEditing: "",
    edit: "",
    message: "",
    messageType: "",
    comment: "",
    comments: [],
    details: {}
  }

  componentDidMount() {
    const { type, id } = this.props.match.params

    this.getDetails(type, id)

    // this.props.getDetails(type, id)
    // API.Comments.pageComments(type, id)
    //   .then(res => {
    //     const comments = res.data
    //     this.setState({ comments })
    //   })
    //   .catch(err => console.log(err))

    // setTimeout(() => this.setState({
    //   details: this.props.details,
    //   isLoaded: true
    // }), 4000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.location !== this.props.location) {
      clearTimeout(this.timer)
      console.log('diff type')
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      this.setState({ isLoaded: false })
      if (this.props.history.action === "POP") {
        console.log("POP")
        this.timer = setTimeout(() => {
          this.getDetails(nextProps.match.params.type, nextProps.match.params.id)
        }, 3000)
      } else {
        console.log(this.props.history.action)
        this.timer = setTimeout(() => {
          this.getDetails(nextProps.match.params.type, nextProps.match.params.id)
        }, 3000)
      }
      return false
    }
    // else if (this.props.match.params.type === "movie" && !this.state.details.revenue) {
    //   console.log('movie wait')
    //   console.log(this.props.match.params.type)
    //   console.log(nextProps.match.params.type)
    //   return true
    // }
    else if (this.props.match.params.type === "movie" && this.state.details.revenue) {
      console.log('movie update')
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      return true
    }
    else {
      console.log('updating')
      console.log(this.state.isLoaded)
      console.log(nextState.isLoaded)
      console.log(this.state.details)
      console.log(nextState.details)
      console.log(this.props.match.params.type)
      console.log(nextProps.match.params.type)
      return true
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  getDetails(type, id) {
    // this.setState({ isLoaded: false })
    console.log(`Getting ${type} ${id}`)
    API.TMDB.details(type, id)
      .then(pageDetails => {
        const details = pageDetails.data
        if (pageDetails.data.name === "Error") return this.getDetails(type, id)
        API.Comments.pageComments(type, id)
          .then(pageComments => {
            const comments = pageComments.data
            this.setState({
              details,
              comments,
              message: "",
              messageType: "",
              isLoaded: true
            })
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
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

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  handleSubmit = e => {
    e.preventDefault()
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
          isLoaded: true
        }), 4000)
      })
      .catch(err => console.log(err))
  }

  deleteComment = e => {
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
    if (this.state.isEditing === "") this.setState({ isEditing: e.target.value })
    else this.setState({ isEditing: "" })
  }

  submitEdit = e => {
    const { authToken } = this.context
    const { isEditing, edit } = this.state
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
    const { user, authToken } = this.context
    const { type, id } = this.props.match.params
    const { details, message, messageType, comment, comments, isLoaded, isEditing, edit } = this.state

    const sqSize = 80
    const strokeWidth = 4
    const radius = (sqSize - strokeWidth) / 2
    const viewBox = `0 0 ${sqSize} ${sqSize}`
    const dashArray = radius * Math.PI * 2

    return (
      <div className="Details pb-5 position-relative">
        {!isLoaded ? (
          <Loader />
        ) : (
            <div className="container pt-3">
              {/* Messages */}
              {message &&
                <div className='row'>
                  <div className='col'>
                    <div className={`alert alert-${messageType} mb-3`} role='alert'>
                      {message}
                    </div>
                  </div>
                </div>}

              {/* Header */}
              <div className="row bg-light-grey" id="details-body">
                <div className="col-12 col-md-8 py-3 position-relative">
                  <div className="p-3" id="details-header">
                    <div className="row no-gutters">
                      <div className="col">
                        <div className="h3">{details.title || details.name}</div>
                      </div>
                    </div>
                    {details.tagline &&
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="h6">{details.tagline}</div>
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

                          {details.genres[0] && <div className="col-6">
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

                  <div className="row no-gutters mt-4 mb-3 text-left">
                    <div className="col-6 col-md-12">
                      <div className="h4">Overview</div>
                      {details.overview &&
                        <p>{details.overview.length > 255 ? `${details.overview.slice(0, 255)}...` : details.overview}</p>}
                      {details.biography &&
                        <p>{details.biography.length > 255 ? `${details.biography.slice(0, 255)}...` : details.biography}</p>}
                    </div>
                    <div className="col-5 ml-auto d-md-none">
                      <img
                        alt="Poster"
                        className="img-fluid rounded"
                        src={
                          (details.poster_path || details.profile_path)
                            ? `https://image.tmdb.org/t/p/original/${details.poster_path || details.profile_path}`
                            : type === "person" ? Person : MediaTall}
                      />
                    </div>
                  </div>
                  <div className="row no-gutters text-left">
                    <div className="col-12 col-lg-8 mb-3">
                      {type === "tv" &&
                        <div>
                          <div className="h4">Created By</div>
                          {details.created_by[0]
                            ? <div className="row no-gutters">
                              {details.created_by.slice(0, 3).map(person => (
                                <div className="col-4 col-lg-6 my-1" key={person.credit_id}>
                                  <div><strong>{person.name}</strong></div>
                                  <div>{person.job}</div>
                                </div>
                              ))}
                            </div>
                            : <div className="col-4 col-lg-6 my-1">
                              <div><strong>Unavailable</strong></div>
                            </div>}
                        </div>}
                      {type === "movie" &&
                        <div>
                          <div className="h4">Featured Crew</div>
                          {details.credits.crew[0]
                            ? <div className="row no-gutters">
                              {details.credits.crew.slice(0, 3).map(crew => (
                                <div className="col-4 col-lg-6 my-1" key={crew.credit_id}>
                                  <div><strong>{crew.name}</strong></div>
                                  <div>{crew.job}</div>
                                </div>
                              ))}
                            </div>
                            : <div className="col-4 col-lg-6 my-1">
                              <div><strong>Unavailable</strong></div>
                            </div>}
                        </div>}
                      {type === "person" &&
                        <div>
                          <div className="h4">Featured Roles</div>
                          <div className="row no-gutters">
                            {details.combined_credits && details.combined_credits.crew.slice(0, 3).map(credit => (
                              <div className="col" key={credit.credit_id || credit.id}>
                                <div><strong>{credit.title || credit.name}</strong></div>
                                <div>{credit.job}</div>
                              </div>
                            ))}
                          </div>
                        </div>}
                    </div>
                    <div className="col col-lg-4 mx-auto text-center d-md-none d-lg-block">
                      {details.vote_average >= 0 &&
                        <div>
                          <div className="h4">Rating</div>
                          <svg
                            width={sqSize}
                            height={sqSize}
                            viewBox={viewBox}>
                            <circle
                              className="circle-background"
                              cx={sqSize / 2}
                              cy={sqSize / 2}
                              r={radius}
                              strokeWidth={`${strokeWidth}px`} />
                            <circle
                              className="circle-progress"
                              cx={sqSize / 2}
                              cy={sqSize / 2}
                              r={radius}
                              strokeWidth={`${strokeWidth}px`}
                              // Start progress marker at 12 O'Clock
                              transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                              style={{
                                strokeDasharray: dashArray,
                                strokeDashoffset: dashArray - dashArray * details.vote_average / 10
                              }} />
                            <text
                              className="circle-text"
                              x="50%"
                              y="50%"
                              dy=".3em"
                              textAnchor="middle">
                              {`${details.vote_average * 10}%`}
                            </text>
                          </svg>
                        </div>}
                      {user && <div className="d-none d-lg-block">
                        <button
                          className="btn btn-outline-dark mt-3"
                          onClick={() => this.addFavorite(
                            type,
                            id,
                            (details.title || details.name),
                            user.id,
                            authToken
                          )}>Add Favorite</button>
                      </div>}
                    </div>
                    {user && <div className="col-6 my-auto text-center d-md-none">
                      <div>
                        <button
                          className="btn btn-outline-dark mt-3"
                          onClick={() => this.addFavorite(
                            type,
                            id,
                            (details.title || details.name),
                            user.id,
                            authToken
                          )}>Add Favorite</button>
                      </div>
                    </div>}
                  </div>
                </div>
                <div className="col-4 py-3 d-none d-md-block">
                  <div className="row no-gutters">
                    <div className="col-12">
                      <img
                        alt="Poster"
                        className="img-fluid rounded"
                        src={
                          (details.poster_path || details.profile_path)
                            ? `https://image.tmdb.org/t/p/original/${details.poster_path || details.profile_path}`
                            : type === "person" ? Person : MediaTall}
                      />
                    </div>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-12 mx-auto mt-4 text-center d-lg-none">
                      {details.vote_average >= 0 &&
                        <div>
                          <div className="h4">Rating</div>
                          <svg
                            width={sqSize}
                            height={sqSize}
                            viewBox={viewBox}>
                            <circle
                              className="circle-background"
                              cx={sqSize / 2}
                              cy={sqSize / 2}
                              r={radius}
                              strokeWidth={`${strokeWidth}px`} />
                            <circle
                              className="circle-progress"
                              cx={sqSize / 2}
                              cy={sqSize / 2}
                              r={radius}
                              strokeWidth={`${strokeWidth}px`}
                              // Start progress marker at 12 O'Clock
                              transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
                              style={{
                                strokeDasharray: dashArray,
                                strokeDashoffset: dashArray - dashArray * details.vote_average / 10
                              }} />
                            <text
                              className="circle-text"
                              x="50%"
                              y="50%"
                              dy=".3em"
                              textAnchor="middle">
                              {`${details.vote_average * 10}%`}
                            </text>
                          </svg>
                        </div>}
                      {user && <div>
                        <button
                          className="btn btn-outline-dark mt-3"
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
              </div>

              {/* Details */}
              <div className="row">
                {/* Slider and Carousel */}
                <div className="col-12 col-lg-9 pt-3 text-left">
                  {details.belongs_to_collection && <div className="row mb-3">
                    <div className="col-12">
                      <div className="h4"><strong>Collection</strong></div>
                      <EpisodeReel
                        data={details.belongs_to_collection}
                        type={type} id={details.belongs_to_collection.id}
                      />
                    </div>
                  </div>}
                  {type === "tv" && <div className="row mb-3">
                    <div className="col-12">
                      <div className="h4"><strong>Episode Guide</strong></div>
                      <EpisodeReel
                        data={details.seasons.length >= 2
                          ? details.seasons.sort((a, b) => a.season_number - b.season_number)
                          : details.seasons}
                        type={type} id={id}
                      />
                    </div>
                  </div>}
                  {type !== "person" ? (
                    <div>
                      <div className="h4"><strong>Cast</strong></div>
                      <CastSlider
                        cast={details.credits.cast.sort((a, b) => a.order - b.order)}
                        type={type}
                      />
                    </div>
                  ) : (
                      <div>
                        <div className="h4"><strong>Credits</strong></div>
                        {details.known_for_department === "Acting" ? (
                          <CastSlider
                            cast={details.combined_credits.cast.sort((a, b) => b.vote_count - a.vote_count)}
                            handler={this.changeMedia}
                            type={type}
                          />
                        ) : (
                            <CastSlider
                              cast={details.combined_credits.crew.slice(0, 30).sort((a, b) => b.vote_count - a.vote_count)}
                              handler={this.changeMedia}
                              type={type}
                            />
                          )}
                      </div>
                    )}
                  {type !== "person" && <div className="row mt-3">
                    <div className="col-12 col-md-6 my-2">
                      <div className="h4"><strong>Others Liked</strong></div>
                      <div className="row bg-light-grey border-round" id="section-recs">
                        <div className="col-12 p-2">
                          {details.recommendations.results.length >= 1 ? (
                            <Carousel data={details.recommendations.results} type={type} handler={this.changeMedia} />
                          ) : (
                              <div className="h6 pl-2"><strong>No recommendations!</strong></div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 my-2">
                      <div className="h4"><strong>Similar</strong></div>
                      <div className="row bg-light-grey border-round" id="section-similar">
                        <div className="col-12 p-2">
                          {details.similar.results.length >= 1 ? (
                            <Carousel data={details.similar.results} type={type} handler={this.changeMedia} />
                          ) : (
                              <div className="h6 pl-2"><strong>Nothing listed as similar!</strong></div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>

                {/* Crew and Facts */}
                <div className="col-12 col-lg-3 pt-3 text-left side-col-lg">
                  {type !== "person" && <div className="h4"><strong>Crew</strong></div>}
                  {type === "movie" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.credits.crew.slice(3, 10).map(person => (
                      <div className="col-3 col-lg-12 pl-2 py-1 mr-0" key={person.credit_id}>
                        <div className="text-sm"><strong>{person.name}</strong></div>
                        <div className="text-xs">{person.job}</div>
                      </div>
                    ))}
                    {details.credits.crew.length <= 3 && <div>
                      <div className="col-12 px-3 py-2">
                        <div className="h6"><strong>Crew unavailable.</strong></div>
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
                    {details.credits.crew.length === 0 && <div>
                      <div className="col-12 px-3 py-2">
                        <div className="h6"><strong>Crew unavailable.</strong></div>
                      </div>
                    </div>}
                  </div>}

                  <div className="h4 mt-2"><strong>Facts</strong></div>
                  {type === "movie" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.homepage && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Homepage</strong></div>
                      <div className="overflow-wrap text-xs"><a href={details.homepage} className="no-link">{details.homepage}</a></div>
                    </div>}
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Status</strong></div>
                      <div className="text-xs">{details.status}</div>
                    </div>
                    {details.revenue !== 0 && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Revenue</strong></div>
                      <div className="text-xs">${details.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>}
                    {details.budget !== 0 && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Budget</strong></div>
                      <div className="text-xs">${details.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>}
                    {details.spoken_languages[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Available Languages</strong></div>
                      {details.spoken_languages.map((lang, index) => (
                        <span key={`${lang.iso_639_1}-${index}`} className="text-xs">{lang.name}{index === details.spoken_languages.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                    {details.original_language && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Original Language</strong></div>
                      <div className="text-xs">{details.original_language}</div>
                    </div>}
                    {details.production_countries[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Production Countries</strong></div>
                      {details.production_countries.map((country, index) => (
                        <span key={`${country.iso_639_1}-${index}`} className="text-xs">{country.name}{index === details.production_countries.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                    {details.production_companies[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Production Companies</strong></div>
                      {details.production_companies.map((company, index) => (
                        <span key={company.id} className="text-xs">{company.name}{index === details.production_companies.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                    {details.keywords.keywords[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Keywords</strong></div>
                      {details.keywords.keywords.map((keyword, index) => (
                        <span key={keyword.id} className="text-xs">{keyword.name}{index === details.keywords.keywords.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                  </div>}
                  {type === "tv" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.homepage && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Homepage</strong></div>
                      <div className="overflow-wrap text-xs"><a href={details.homepage} className="no-link">{details.homepage}</a></div>
                    </div>}
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Type</strong></div>
                      <div className="text-xs">{details.type}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Status</strong></div>
                      <div className="text-xs">{details.status}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>In Production</strong></div>
                      <div className="text-xs">{details.in_production ? "Yes" : "No"}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Number of Seasons</strong></div>
                      <div className="text-xs">{details.number_of_seasons}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Number of Episodes</strong></div>
                      <div className="text-xs">{details.number_of_episodes}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>First Aired</strong></div>
                      <div className="text-xs">{moment(details.first_air_date).format("MMMM Do, YYYY")}</div>
                    </div>
                    {details.next_episode_to_air && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Next Episode to Air</strong></div>
                      <div className="text-xs">{details.next_episode_to_air.name}</div>
                      <div className="text-xs">{moment(details.next_episode_to_air.air_date).format("MMMM Do, YYYY")}</div>
                    </div>}
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Last Episode to Air</strong></div>
                      <div className="text-xs">{details.last_episode_to_air.name}</div>
                      <div className="text-xs">{moment(details.last_episode_to_air.air_date).format("MMMM Do, YYYY")}</div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Networks</strong></div>
                      {details.networks.map(network => <div className="text-xs" key={network.id}>{network.name}</div>)}
                    </div>
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Available Languages</strong></div>
                      {details.languages.map(language => <div className="text-xs" key={language}>{language}</div>)}
                    </div>
                    {details.languages[0] !== details.original_language && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Original Language</strong></div>
                      <div className="text-xs">{details.original_language}</div>
                    </div>}
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Country of Origin</strong></div>
                      <div className="text-xs">{details.origin_country}</div>
                    </div>
                    {details.keywords.results[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Keywords</strong></div>
                      {details.keywords.results.map((keyword, index) => (
                        <span key={keyword.id} className="text-xs">{keyword.name}{index === details.keywords.results.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                  </div>}
                  {type === "person" && <div className="row no-gutters bg-light-grey border-round py-2">
                    {details.homepage && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Homepage</strong></div>
                      <div className="overflow-wrap text-xs"><a href={details.homepage} className="no-link">{details.homepage}</a></div>
                    </div>}
                    <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Birthday</strong></div>
                      {details.birthday ? (
                        <div className="text-xs">{moment(details.birthday).format("MMMM Do, YYYY")}</div>
                      ) : (
                        <div className="text-xs">Unavailable</div>
                      )}
                    </div>
                    {details.deathday && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Died</strong></div>
                      <div className="text-xs">{moment(details.deathday).format("MMMM Do, YYYY")}</div>
                    </div>}
                    {details.also_known_as[0] && <div className="col-6 col-md-4 col-lg-12 px-2 py-1">
                      <div className="text-sm"><strong>Also known as</strong></div>
                      {details.also_known_as.map((name, index) => (
                        <span key={name} className="text-xs">{name}{index === details.also_known_as.length - 1 ? "" : ", "}</span>
                      ))}
                    </div>}
                  </div>}
                </div>
              </div>

              {/* Comments */}
              <div className="row">
                <div className="col-12 col-lg-9 my-2 text-left px-0">
                  <div className="h4"><strong>Add a Comment</strong></div>
                  <div className="row no-gutters bg-light-grey border-round my-3">
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
                            <button className='btn btn-outline-dark float-right' type='submit'>Post</button>
                          </div>
                        </form>
                      </div>
                    ) : (
                        <div className="col-12 p-3">
                          <div className="h5 pl-2">Log in to comment!</div>
                        </div>
                      )}
                  </div>

                  <div className="h4"><strong>Comments</strong></div>
                  <div className="row no-gutters bg-light-grey border-round py-2">
                    {comments[0] ? (
                      comments.map(comment => (
                        <div className="col-12 p-2" key={comment.id}>
                          <div className="card bg-purple text-white text-left">
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
                        <div className="col-12 p-2">
                          <div className="h5 text-center">No comments yet!</div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-12 col-lg-3 my-2 side-col-lg">
                  <div className="h4 text-left"><strong>Reviews</strong></div>
                  <div className="row no-gutters bg-light-grey border-round py-2">
                    {(details.reviews.results && details.reviews.results[0]) ? (
                      details.reviews.results.map(review => (
                        <div className="col-12 p-2" key={review.id}>
                          <div className="card bg-dark text-white text-left">
                            <div className="card-header">
                              <Gravatar className="rounded-circle" email={review.author} size={30} /> {review.author}
                            </div>
                            <div className="card-body">
                              <p>{review.content.length > 255
                                ? `${review.content.slice(0, 255)}...`
                                : review.content}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                        <div className="col-12 p-2">
                          <div className="h5">No reviews yet!</div>
                        </div>
                      )}
                  </div>
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
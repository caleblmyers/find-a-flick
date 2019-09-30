import React, { Component } from 'react'

import AuthContext from '../../contexts/AuthContext'
import API from '../../lib/API'
import ResultsGrid from '../../components/ResultsGrid'

class Discover extends Component {
  static contextType = AuthContext

  state = {
    queries: {
      movie: [
        {
          name: "What movies are new?",
          data: {
            releaseDateGt: "2019-08-25",
            releaseDateLt: "2019-09-27",
            sort: "release_date.desc",
            voteCountGt: "50"
          }
        },
        // {
        //   name: "What are the most popular movies?",
        //   data: {
        //     sort: "popularity.desc"
        //   }
        // },
        {
          name: "What are the highest rated movies rated R?",
          data: {
            certificationCountry: "US",
            certification: "R",
            sort: "vote_average.desc",
            voteCountGt: "500"
          }
        },
        {
          name: "What are the most popular kids movies?",
          data: {
            certificationCountry: "US",
            certificationLt: "G",
            sort: "popularity.desc",
            voteCountGt: "250"
          }
        },
        {
          name: "What are the best movies from 2010?",
          data: {
            releaseYear: "2010",
            sort: "vote_average.desc",
            voteCountGt: "500"
          }
        },
        {
          name: "What are the best dramas that were released this year?",
          data: {
            genres: "18",
            releaseYear: "2019",
            voteCountGt: "500"
          }
        },
        {
          name: "What are the highest rated science fiction movies that Tom Cruise has been in?",
          data: {
            genres: "878",
            cast: "500",
            sort: "vote_average.desc"
          }
        },
        {
          name: "What are the Will Ferrell's highest grossing comedies?",
          data: {
            genres: "35",
            cast: "23659",
            sort: "revenue.desc"
          }
        },
        {
          name: "Have Brad Pitt and Edward Norton ever been in a movie together?",
          data: {
            people: "287,819",
            sort: "vote_average.desc"
          }
        },
        {
          name: "Has David Fincher ever worked with Rooney Mara?",
          data: {
            people: "108916,7467",
            sort: "popularity.desc"
          }
        },
        {
          name: "What are the best dramas?",
          data: {
            genres: "18",
            sort: "vote_average.desc",
            voteCountGt: "10"
          }
        },
        {
          name: "What are Liam Neeson's highest grossing rated 'R' movies?",
          data: {
            certificationCountry: "US",
            certification: "R",
            sort: "revenue.desc",
            cast: "3896"
          }
        },
      ],
      tv: [
        {
          name: "What shows are new?",
          data: {
            releaseDateGt: "2019-08-25",
            releaseDateLt: "2019-09-27",
            sort: "first_air_date.desc"
          }
        },
        {
          name: "What shows are new?",
          data: {
            releaseDateGt: "2019-08-25",
            releaseDateLt: "2019-09-27"
          }
        },
        {
          name: "What shows are new?",
          data: {
            releaseDateGt: "2019-08-25",
            releaseDateLt: "2019-09-27"
          }
        },
      ]
    },
    activeTab: 'movie',
    query: 'What movies are new?',
    params: {
      cast: '',
      companies: '',
      crew: '',
      certification: '',
      certificationCountry: '',
      certificationGt: '',
      certificationLt: '',
      genres: '',
      keywords: '',
      language: '',
      noGenres: '',
      noKeywords: '',
      people: '',
      primaryReleaseDateGt: '',
      primaryReleaseDateLt: '',
      region: '',
      releaseDateGt: '',
      releaseDateLt: '',
      releaseYear: '',
      runtimeGt: '',
      runtimeLt: '',
      sort: '',
      voteCountGt: '',
      voteCountLt: '',
      voteAverageGt: '',
      voteAverageLt: ''
    },
    advanced: false,
    results: undefined,
    favPeople: [],
    peopleLoaded: false,
    ratings: {}
  }

  componentDidMount() {
    console.log('getting ratings...')
    API.TMDB.ratings()
      .then(ratings => this.setState({ ratings: ratings.data.certifications }))
      .catch(err => console.log(err))
  }

  componentDidUpdate() {
    const { user, authToken } = this.context

    if (user && !this.state.peopleLoaded) {
      console.log('getting people')
      API.Favorites.people(user.id, authToken)
        .then(res => {
          this.setState({
            peopleLoaded: true,
            favPeople: res.data
          })
        })
        .catch(err => console.log(err))
    }
  }

  handleChange = e => {
    if (e.target.classList.contains("param")) {
      let params = this.state.params
      if (e.target.classList.contains("enre")) {
        let i = e.target.selectedIndex
        let selected = e.target.childNodes[i]
        params[e.target.name] = selected.value
      } else params[e.target.name] = e.target.value

      this.setState({ params })
    } else if (e.target.name === "activeTab") {
      let params = this.state.params
      Object.keys(params).forEach(param => params[param] = "")
      this.setState({
        params,
        // advanced: false,
        activeTab: e.target.id.slice(4, e.target.id.length - 4)
      })
    } else if (e.target.name === "query") this.setState({ [e.target.name]: e.target.value })
    else if (e.target.type === "checkbox") this.setState({ advanced: !this.state.advanced })
    else this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { queries, params, advanced, activeTab } = this.state
    let queryParams = {
      cast: '',
      companies: '',
      crew: '',
      certification: '',
      certificationCountry: '',
      certificationGt: '',
      certificationLt: '',
      genres: '',
      keywords: '',
      language: '',
      noGenres: '',
      noKeywords: '',
      people: '',
      primaryReleaseDateGt: '',
      primaryReleaseDateLt: '',
      region: '',
      releaseDateGt: '',
      releaseDateLt: '',
      releaseYear: '',
      runtimeGt: '',
      runtimeLt: '',
      sort: '',
      voteCountGt: '50',
      voteCountLt: '',
      voteAverageGt: '',
      voteAverageLt: ''
    }

    if (!advanced) {
      let queryIndex = 0
      queries[activeTab].forEach((query, index) => queryIndex = query.name === this.state.query ? index : queryIndex)
      Object.keys(queries[activeTab][queryIndex].data).forEach(key => queryParams[key] = queries[activeTab][queryIndex].data[key])
    } else {
      Object.keys(params).forEach(key => queryParams[key] = params[key])
    }

    API.TMDB.discover(activeTab, queryParams)
      .then(res => {
        Object.keys(queryParams).forEach(key => queryParams[key] = '')
        console.log(res.data)
        this.setState({
          results: res.data.results,
          params: queryParams
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { user } = this.context
    const { query, queries, params, favPeople, ratings, activeTab } = this.state

    return (
      <div className="Discover">
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="display-3">Pop Media</div>
            <div className="lead pt-2">Discover something new!</div>
            <nav className="mt-3">
              <div className="nav nav-pills justify-content-center" id="nav-tab" role="tablist">
                <a onClick={this.handleChange} name="activeTab" value="movie" className="nav-item nav-link active" id="nav-movie-tab" data-toggle="tab" href="#nav-movie" role="tab" aria-controls="nav-movie" aria-selected="true">Movies</a>
                <a onClick={this.handleChange} name="activeTab" value="tv" className="nav-item nav-link" id="nav-tv-tab" data-toggle="tab" href="#nav-tv" role="tab" aria-controls="nav-tv" aria-selected="false">TV Shows</a>
              </div>
            </nav>
            <form onSubmit={this.handleSubmit}>
              <h1 className="mt-4">Query Search</h1>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  name="advanced"
                  checked={this.state.advanced}
                  onChange={this.handleChange}
                  className="form-check-input"
                  id="inputCheck1"
                  aria-label="Example select with button addon"
                />
                <label className="form-check-label">Advanced</label>
              </div>
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane show active" id="nav-movie" role="tabpanel" aria-labelledby="nav-movie-tab">
                  <div className="form-group">
                    {!this.state.advanced ? (
                      <div className="form-group">
                        <label>Choose an option...</label>
                        <div className="input-group">
                          <select
                            name="query"
                            value={query}
                            onChange={this.handleChange}
                            className="custom-select"
                            id="inputGroupSelect04"
                            aria-label="Example select with button addon"
                          >
                            {queries[activeTab].map((query, index) => (
                              <option key={index}>{query.name}</option>
                            ))}
                          </select>
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit">Discover</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className="form-group">

                          <div className="form-row">
                            <div className="form-group col-md-5">
                              <label>Start Date</label>
                              <input
                                type="date"
                                className="form-control param"
                                id="primaryReleaseDateGt"
                                name="primaryReleaseDateGt"
                                value={params.primaryReleaseDateGt}
                                onChange={this.handleChange}
                                min="1900-01-01"
                                max="2019-10-01"
                                placeholder="1950/01/20"
                              />
                            </div>
                            <div className="form-group col-md-5">
                              <label>End Date</label>
                              <input
                                type="date"
                                className="form-control param"
                                id="primaryReleaseDateLt"
                                name="primaryReleaseDateLt"
                                value={params.primaryReleaseDateLt}
                                onChange={this.handleChange}
                                min="1900-01-01"
                                max="2019-10-01"
                                placeholder="2019/01/20"
                              />
                            </div>
                            <div className="form-group col-md-2">
                              <label>Release Year</label>
                              <input
                                className="form-control param"
                                type="number"
                                name="releaseYear"
                                value={params.releaseYear}
                                onChange={this.handleChange}
                                placeholder="2010"
                                min="1900"
                                max="2019"
                                id=""
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-3">
                              <label>Vote Count (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteCountLt"
                                name="voteCountLt"
                                value={params.voteCountLt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="10000"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Count (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteCountGt"
                                name="voteCountGt"
                                value={params.voteCountGt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="0"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Average (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteAverageLt"
                                name="voteAverageLt"
                                value={params.voteAverageLt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="10"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Average (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteAverageGt"
                                name="voteAverageGt"
                                value={params.voteAverageGt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="6"
                              />
                            </div>

                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-4">
                              <label>With Genres</label>
                              <select
                                type="text"
                                className="form-control param genre"
                                id="genres"
                                name="genres"
                                value={params.genres}
                                onChange={this.handleChange}
                              >
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="80">Crime</option>
                                <option value="99">Documentary</option>
                                <option value="18">Drama</option>
                                <option value="10751">Family</option>
                                <option value="14">Fantasy</option>
                                <option value="36">History</option>
                                <option value="27">Horror</option>
                                <option value="10402">Music</option>
                                <option value="9648">Mystery</option>
                                <option value="10749">Romance</option>
                                <option value="878">Science Fiction</option>
                                <option value="10770">TV Movie</option>
                                <option value="53">Thriller</option>
                                <option value="10752">War</option>
                                <option value="37">Western</option>
                              </select>
                            </div>
                            <div className="form-group col-md-4">
                              <label>Without Genres</label>
                              <select
                                type="text"
                                className="form-control param genre"
                                id="noGenres"
                                name="noGenres"
                                value={params.noGenres}
                                onChange={this.handleChange}
                              >
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="80">Crime</option>
                                <option value="99">Documentary</option>
                                <option value="18">Drama</option>
                                <option value="10751">Family</option>
                                <option value="14">Fantasy</option>
                                <option value="36">History</option>
                                <option value="27">Horror</option>
                                <option value="10402">Music</option>
                                <option value="9648">Mystery</option>
                                <option value="10749">Romance</option>
                                <option value="878">Science Fiction</option>
                                <option value="10770">TV Movie</option>
                                <option value="53">Thriller</option>
                                <option value="10752">War</option>
                                <option value="37">Western</option>
                              </select>
                            </div>
                            <div className="form-group col-md-2">
                              <label>Runtime (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="runtimeLt"
                                name="runtimeLt"
                                value={params.runtimeLt}
                                onChange={this.handleChange}
                                min="0"
                                max="360"
                                placeholder="10"
                              />
                            </div>
                            <div className="form-group col-md-2">
                              <label>Runtime (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="runtimeGt"
                                name="runtimeGt"
                                value={params.runtimeGt}
                                onChange={this.handleChange}
                                min="0"
                                max="360"
                                placeholder="6"
                              />
                            </div>

                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-4">
                              <label>With People</label>
                              {user && favPeople[0] ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="people"
                                  name="people"
                                  value={params.people}
                                  onChange={this.handleChange}
                                >
                                  {favPeople.map(person => (
                                    <option value={person.tmdbId} key={person.id}>{person.title}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="people"
                                    name="people"
                                    value={params.people}
                                    onChange={this.handleChange}
                                  >
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Rating Country</label>
                              <select
                                type="text"
                                className="form-control param"
                                id="certificationCountry"
                                name="certificationCountry"
                                value={params.certificationCountry}
                                onChange={this.handleChange}
                              >
                                <option value="">Countries</option>
                                {Object.keys(ratings).map(country => (
                                  <option value={country} key={country}>{country}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-md-2">
                              <label>Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certification"
                                  name="certification"
                                  value={params.certification}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certification"
                                    name="certification"
                                    value={params.certification}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Min Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certificationGt"
                                  name="certificationGt"
                                  value={params.certificationGt}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certificationGt"
                                    name="certificationGt"
                                    value={params.certificationGt}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Max Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certificationLt"
                                  name="certificationLt"
                                  value={params.certificationLt}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certificationLt"
                                    name="certificationLt"
                                    value={params.certificationLt}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                          </div>

                          <button type="submit" className="btn btn-outline-secondary">Discover</button>
                        </div>
                      )}
                  </div>
                </div>
                <div className="tab-pane" id="nav-tv" role="tabpanel" aria-labelledby="nav-tv-tab">
                  <div className="form-group">
                    {!this.state.advanced ? (
                      <div className="form-group">
                        <label>Choose an option...</label>
                        <div className="input-group">
                          <select
                            name="query"
                            value={query}
                            onChange={this.handleChange}
                            className="custom-select"
                            id="inputGroupSelect04"
                            aria-label="Example select with button addon"
                          >
                            {queries[activeTab].map((query, index) => (
                              <option key={index}>{query.name}</option>
                            ))}
                          </select>
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit">Discover</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                        <div className="form-group">

                          <div className="form-row">
                            <div className="form-group col-md-5">
                              <label>Start Date</label>
                              <input
                                type="date"
                                className="form-control param"
                                id="primaryReleaseDateGt"
                                name="primaryReleaseDateGt"
                                value={params.primaryReleaseDateGt}
                                onChange={this.handleChange}
                                min="1900-01-01"
                                max="2019-10-01"
                                placeholder="1950/01/20"
                              />
                            </div>
                            <div className="form-group col-md-5">
                              <label>End Date</label>
                              <input
                                type="date"
                                className="form-control param"
                                id="primaryReleaseDateLt"
                                name="primaryReleaseDateLt"
                                value={params.primaryReleaseDateLt}
                                onChange={this.handleChange}
                                min="1900-01-01"
                                max="2019-10-01"
                                placeholder="2019/01/20"
                              />
                            </div>
                            <div className="form-group col-md-2">
                              <label>Release Year</label>
                              <input
                                className="form-control param"
                                type="number"
                                name="releaseYear"
                                value={params.releaseYear}
                                onChange={this.handleChange}
                                placeholder="2010"
                                min="1900"
                                max="2019"
                                id=""
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-3">
                              <label>Vote Count (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteCountLt"
                                name="voteCountLt"
                                value={params.voteCountLt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="10000"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Count (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteCountGt"
                                name="voteCountGt"
                                value={params.voteCountGt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="0"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Average (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteAverageLt"
                                name="voteAverageLt"
                                value={params.voteAverageLt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="10"
                              />
                            </div>
                            <div className="form-group col-md-3">
                              <label>Vote Average (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="voteAverageGt"
                                name="voteAverageGt"
                                value={params.voteAverageGt}
                                onChange={this.handleChange}
                                min="0"
                                placeholder="6"
                              />
                            </div>

                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-4">
                              <label>With Genres</label>
                              <select
                                type="text"
                                className="form-control param genre"
                                id="genres"
                                name="genres"
                                value={params.genres}
                                onChange={this.handleChange}
                              >
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="80">Crime</option>
                                <option value="99">Documentary</option>
                                <option value="18">Drama</option>
                                <option value="10751">Family</option>
                                <option value="14">Fantasy</option>
                                <option value="36">History</option>
                                <option value="27">Horror</option>
                                <option value="10402">Music</option>
                                <option value="9648">Mystery</option>
                                <option value="10749">Romance</option>
                                <option value="878">Science Fiction</option>
                                <option value="10770">TV Movie</option>
                                <option value="53">Thriller</option>
                                <option value="10752">War</option>
                                <option value="37">Western</option>
                              </select>
                            </div>
                            <div className="form-group col-md-4">
                              <label>Without Genres</label>
                              <select
                                type="text"
                                className="form-control param genre"
                                id="noGenres"
                                name="noGenres"
                                value={params.noGenres}
                                onChange={this.handleChange}
                              >
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="80">Crime</option>
                                <option value="99">Documentary</option>
                                <option value="18">Drama</option>
                                <option value="10751">Family</option>
                                <option value="14">Fantasy</option>
                                <option value="36">History</option>
                                <option value="27">Horror</option>
                                <option value="10402">Music</option>
                                <option value="9648">Mystery</option>
                                <option value="10749">Romance</option>
                                <option value="878">Science Fiction</option>
                                <option value="10770">TV Movie</option>
                                <option value="53">Thriller</option>
                                <option value="10752">War</option>
                                <option value="37">Western</option>
                              </select>
                            </div>
                            <div className="form-group col-md-2">
                              <label>Runtime (max)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="runtimeLt"
                                name="runtimeLt"
                                value={params.runtimeLt}
                                onChange={this.handleChange}
                                min="0"
                                max="360"
                                placeholder="10"
                              />
                            </div>
                            <div className="form-group col-md-2">
                              <label>Runtime (min)</label>
                              <input
                                type="number"
                                className="form-control param"
                                id="runtimeGt"
                                name="runtimeGt"
                                value={params.runtimeGt}
                                onChange={this.handleChange}
                                min="0"
                                max="360"
                                placeholder="6"
                              />
                            </div>

                          </div>

                          <div className="form-row">
                            <div className="form-group col-md-4">
                              <label>With People</label>
                              {user && favPeople[0] ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="people"
                                  name="people"
                                  value={params.people}
                                  onChange={this.handleChange}
                                >
                                  {favPeople.map(person => (
                                    <option value={person.tmdbId} key={person.id}>{person.title}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="people"
                                    name="people"
                                    value={params.people}
                                    onChange={this.handleChange}
                                  >
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                    <option>Person</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Rating Country</label>
                              <select
                                type="text"
                                className="form-control param"
                                id="certificationCountry"
                                name="certificationCountry"
                                value={params.certificationCountry}
                                onChange={this.handleChange}
                              >
                                <option value="">Countries</option>
                                {Object.keys(ratings).map(country => (
                                  <option value={country} key={country}>{country}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-md-2">
                              <label>Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certification"
                                  name="certification"
                                  value={params.certification}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certification"
                                    name="certification"
                                    value={params.certification}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Min Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certificationGt"
                                  name="certificationGt"
                                  value={params.certificationGt}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certificationGt"
                                    name="certificationGt"
                                    value={params.certificationGt}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                            <div className="form-group col-md-2">
                              <label>Max Rating</label>
                              {params.certificationCountry !== "" ? (
                                <select
                                  type="text"
                                  className="form-control param"
                                  id="certificationLt"
                                  name="certificationLt"
                                  value={params.certificationLt}
                                  onChange={this.handleChange}
                                >
                                  <option value="">--</option>
                                  {ratings[params.certificationCountry].map(rating => (
                                    <option value={rating.certification} key={rating.order}>{rating.certification}</option>
                                  ))}
                                </select>
                              ) : (
                                  <select
                                    type="text"
                                    className="form-control param"
                                    id="certificationLt"
                                    name="certificationLt"
                                    value={params.certificationLt}
                                    onChange={this.handleChange}
                                    disabled
                                  >
                                    <option>Ratings</option>
                                  </select>
                                )}
                            </div>
                          </div>

                          <button type="submit" className="btn btn-outline-secondary">Discover</button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {this.state.results && <div className="row no-gutters bg-popcorn">
          <div className="col">
            <h3>Results</h3>
            {this.state.results[0] ? (
              <ResultsGrid results={this.state.results} type="movie" />
            ) : (
                <h1>No Matches!</h1>
              )}
          </div>
        </div>}
      </div>
    )
  }
}

export default Discover

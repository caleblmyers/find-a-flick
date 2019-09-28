import React, { Component } from 'react'

import API from '../../lib/API'
import ResultsGrid from '../../components/ResultsGrid'

class Discover extends Component {
  state = {
    queries: [
      {
        name: "What movies are in theatres?",
        data: {
          releaseDateGt: "2019-08-25",
          releaseDateLt: "2019-09-27"
        }
      },
      {
        name: "What are the most popular movies?",
        data: {
          sort: "popularity.desc"
        }
      },
      {
        name: "What are the highest rated movies rated R?",
        data: {
          certificationCountry: "US",
          certification: "R",
          sort: "vote_average.desc"
        }
      },
      {
        name: "What are the most popular kids movies?",
        data: {
          certificationCountry: "US",
          certificationLt: "G",
          sort: "popularity.desc"
        }
      },
      {
        name: "What is are the best movies from 2010?",
        data: {
          releaseYear: "2010",
          sort: "vote_average.desc"
        }
      },
      {
        name: "What are the best dramas that were released this year?",
        data: {
          genres: "18",
          releaseYear: "2019"
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
    query: 'What movies are in theatres?',
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
    results: undefined
  }

  handleChange = e => {
    if (e.target.classList.contains("param")) {
      let params = this.state.params
      params[e.target.name] = e.target.value
      this.setState({ params })
    }
    else if (e.target.type === "checkbox") this.setState({ advanced: !this.state.advanced })
    else this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const { queries, params, advanced } = this.state

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
      voteCountGt: '',
      voteCountLt: '',
      voteAverageGt: '',
      voteAverageLt: ''
    }

    if (!advanced) {
      let queryIndex = 0

      queries.forEach((query, index) => {
        if (query.name === this.state.query) queryIndex = index
      })

      Object.keys(queries[queryIndex].data).forEach(key => queryParams[key] = queries[queryIndex].data[key])
    } else {
      Object.keys(params).forEach(key => queryParams[key] = params[key])
    }

    API.TMDB.discover(queryParams)
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
    let { params } = this.state

    return (
      <div className="Discover">
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <div className="display-3">Pop Media</div>
            <div className="lead pt-2">Discover something new!</div>
            <nav className="mt-3">
              <div className="nav nav-pills justify-content-center" id="nav-tab" role="tablist">
                <a className="nav-item nav-link active" id="nav-movie-tab" data-toggle="tab" href="#nav-movie" role="tab" aria-controls="nav-movie" aria-selected="true">Movie</a>
                <a className="nav-item nav-link" id="nav-tv-tab" data-toggle="tab" href="#nav-tv" role="tab" aria-controls="nav-tv" aria-selected="false">TV Shows</a>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-movie" role="tabpanel" aria-labelledby="nav-movie-tab">
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
                    <label className="form-check-label">Check me out</label>
                  </div>
                  {!this.state.advanced ? (
                    <div className="form-group">
                      <label>Example query</label>
                      <div className="input-group">
                        <select
                          name="query"
                          value={this.state.query}
                          onChange={this.handleChange}
                          className="custom-select"
                          id="inputGroupSelect04"
                          aria-label="Example select with button addon"
                        >
                          {this.state.queries.map((query, index) => (
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

                        <div className="form-group">
                          <label>Address</label>
                          <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                        </div>
                        <div className="form-group">
                          <label>Address 2</label>
                          <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                        </div>
                        <div className="form-row">
                          <div className="form-group col-md-6">
                            <label>City</label>
                            <input type="text" className="form-control" id="inputCity" />
                          </div>
                          <div className="form-group col-md-4">
                            <label>State</label>
                            <select id="inputState" className="form-control">
                              <option selected>Choose...</option>
                              <option>...</option>
                            </select>
                          </div>
                          <div className="form-group col-md-2">
                            <label>Zip</label>
                            <input type="text" className="form-control" id="inputZip" />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="gridCheck" />
                            <label className="form-check-label">
                              Check me out
                          </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Sign in</button>
                      </div>
                    )}
                </form>

                {this.state.results && <div className="container">
                  <div className="row">
                    <div className="col">
                      <h3>Query Data</h3>
                      {this.state.results && <ResultsGrid results={this.state.results} />}
                    </div>
                  </div>
                </div>}

              </div>
              <div className="tab-pane fade" id="nav-tv" role="tabpanel" aria-labelledby="nav-tv-tab">
                <h1>TV Shows</h1>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default Discover

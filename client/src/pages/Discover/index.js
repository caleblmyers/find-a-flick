import React, { Component } from 'react'
import SearchBar from '../../components/SearchBar'

class Discover extends Component {
  state = {
    results: []
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log('submitted')
  }

  render() {
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
                <h1 className="mt-4">Query Search</h1>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label>Example select</label>
                    <div className="input-group">
                      <select className="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon">
                        <option>What movies are in theatres?</option>
                        <option>What are the most popular movies?</option>
                        <option>What are the highest rated movies rated R?</option>
                        <option>What are the most popular kids movies?</option>
                        <option>What is are the best movies from 2010?</option>
                        <option>What are the best dramas that were released this year?</option>
                        <option>What are the highest rated science fiction movies that Tom Cruise has been in?</option>
                        <option>What are the Will Ferrell's highest grossing comedies?</option>
                        <option>Have Brad Pitt and Edward Norton ever been in a movie together?</option>
                        <option>Has David Fincher ever worked with Rooney Mara?</option>
                        <option>What are the best drama's?</option>
                        <option>What are Liam Neeson's highest grossing rated 'R' movies?</option>
                      </select>
                      <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="submit">Discover</button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="container">
                  <div className="row">
                    <div className="col">
                      <h3>Query Data</h3>
                    </div>
                  </div>
                </div>

                {/* <h1 className="mt-4">Advanced Form</h1>
                <form className="mt-4">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Email</label>
                      <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Password</label>
                      <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
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
                      <label className="form-check-label">Check me out</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Sign in</button>
                </form> */}
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

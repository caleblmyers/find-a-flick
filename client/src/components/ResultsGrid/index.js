import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

function ResultsGrid(props) {
  return (
    <div className="ResultsGrid row no-gutters justify-content-center">
      {props.results.map(result => (
        <div className="col-12 col-md-6 col-xl-3 p-3" key={result.id}>
          <div className="card border-secondary rounded bg-blue-lt mb-3">
            <div className="row no-gutters">
              <div className="col-12 col-md-5">
                <img className="img-fluid rounded" src={`https://image.tmdb.org/t/p/original/${result.poster_path}`} alt="..." />
              </div>
              <div className="col-12 col-md-7">
                <div className="card-body">
                  <h5 className="card-title">{result.title || result.name}</h5>
                  <h6 className="card-subtitle text-muted capitalize">{result.media_type}</h6>
                  <h6 className="card-subtitle text-muted">
                    Release Date: {moment((result.release_date || result.first_air_date)).format("MM/DD/YYYY")}
                  </h6>
                  <p>Rating: {result.vote_average} <small>({result.vote_count})</small></p>
                  <Link to={`/details/${result.media_type || props.type}/${result.id}`}>
                    <button className="btn btn-outline-secondary">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ResultsGrid

import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import Person from '../../img/person_placeholder.png'
import MediaTall from '../../img/media_placeholder_tall.png'

function ResultsGrid(props) {
  const sqSize = 80
  const strokeWidth = 4
  const radius = (sqSize - strokeWidth) / 2
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  const dashArray = radius * Math.PI * 2

  const type = props.results[0].name ? "tv" : "movie"

  const genres = {
    movie: {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western"
    },
    tv: {
      10759: "Action & Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      10762: "Kids",
      9648: "Mystery",
      10763: "News",
      10764: "Reality",
      10765: "Sci-Fi & Fantasy",
      10766: "Soap",
      10767: "Talk",
      10768: "War & Politics",
      37: "Western"
    }
  }

  return (
    <div className="ResultsGrid row no-gutters justify-content-center">
      {props.results.map(result => (
        <div className="col-6 col-md-4 col-lg-6 col-xl-3 p-3" key={result.id}>
          <div className="card border-dark rounded bg-blue-lt mb-3">
            <div className="row no-gutters">
              <div className="col-12 col-lg-5">
                <img
                  alt="Result"
                  className="img-fluid rounded"
                  src={result.media_type === "person"
                    ? result.profile_path ? `https://image.tmdb.org/t/p/original/${result.profile_path}` : Person
                    : result.poster_path ? `https://image.tmdb.org/t/p/original/${result.poster_path}` : MediaTall}
                />
              </div>
              <div className="col-12 col-lg-7">
                <div className="card-body p-1">
                  <h5 className="px-3 pt-2">{result.title || result.name}</h5>
                  <h6 className="text-muted capitalize">{result.media_type}</h6>
                  <h6 className="text-muted">
                    Release Date: {moment((result.release_date || result.first_air_date)).format("MM/DD/YYYY")}
                  </h6>
                  {result.genre_ids && <h6 className="text-muted">
                    {result.genre_ids.map((genre, index) => (
                      <span key={genre}>{index !== result.genre_ids.length - 1 ? `${genres[type][genre]}, ` : genres[type][genre]}</span>
                    ))}
                  </h6>}
                  <div className="row no-gutters mt-3">
                    {result.vote_average >= 0 &&
                      <div className="col-12 col-md-6">
                        <div>
                          <div className="text-sm pb-2">Rating <span className="text-xs">({`${result.vote_count} votes`})</span></div>
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
                                strokeDashoffset: dashArray - dashArray * result.vote_average / 10
                              }} />
                            <text
                              className="circle-text"
                              x="50%"
                              y="50%"
                              dy=".3em"
                              textAnchor="middle">
                              {`${result.vote_average * 10}%`}
                            </text>
                          </svg>
                        </div>
                      </div>}
                    <div className="col align-self-center">
                      <Link to={`/details/${result.media_type || props.type}/${result.id}`}>
                        <button className="btn btn-outline-dark my-2">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
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

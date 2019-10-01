import React from 'react'
import { Link } from 'react-router-dom'

function Table(props) {
  return (
    <table className="table table-sm table-hover table-borderless">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Rating</th>
        </tr>
      </thead>
      <tbody>
        {props.dataSet.map((data, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>
              <Link className="now-playing" to={`/details/${props.type}/${data.id}`}>
                <span>
                  {data.title || data.name}
                </span>
              </Link>
            </td>
            <td>{data.vote_average}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table

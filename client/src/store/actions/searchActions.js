import { PROCESS_SEARCH, GET_SEARCH, GET_DETAILS } from './types'
import API from '../../lib/API'

export const processSearch = keyword => dispatch => {
  API.TMDB.search(keyword)
    .then(res => {
      dispatch({
        type: PROCESS_SEARCH,
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}

export const getSearch = e => dispatch => {
  dispatch({
    type: GET_SEARCH,
    payload: e.target.value
  })
}

export const getDetails = (type, id) => dispatch => {
  API.TMDB.details(type, id)
    .then(res => {
      console.log(res.data)
      dispatch({
        type: GET_DETAILS,
        payload: res.data
      })
    })
    .catch(err => console.log(err))
}
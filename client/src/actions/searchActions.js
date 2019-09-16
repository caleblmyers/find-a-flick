import { PROCESS_SEARCH, GET_SEARCH } from './types'
import API from '../lib/API'

export const processSearch = () => (dispatch, getState) => {
  let { keyword } = getState().search
  API.TMDB.search('search', keyword)
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
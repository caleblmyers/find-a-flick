import { PROCESS_SEARCH, GET_SEARCH } from '../actions/types'

const initialState = {
  results: [],
  keyword: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case PROCESS_SEARCH:
      return {
        ...state,
        results: action.payload
      }

    case GET_SEARCH:
      return {
        ...state,
        keyword: action.payload
      }

    default:
      return state
  }
}
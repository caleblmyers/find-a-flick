import { PROCESS_SEARCH, GET_SEARCH, GET_DETAILS } from '../actions/types'

const initialState = {
  results: [],
  keyword: '',
  details: {}
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

    case GET_DETAILS:
      return {
        ...state,
        details: action.payload
      }

    default:
      return state
  }
}
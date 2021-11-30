import {
  STATS_LOADING,
  STATS_LOADED,
  STATS_FAIL
} from '../actions/actionTypes';

const initialState = {
  isLoading: false,
  stats: {
    currentSemester: {}
  }
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case STATS_LOADED:
      return {
        ...state,
        isLoading: false,
        stats: action.payload
      };
    case STATS_FAIL:
      return {
        ...state,
        isLoading: false
      };
    default:
      return { ...state };
  }
};

export default statsReducer;

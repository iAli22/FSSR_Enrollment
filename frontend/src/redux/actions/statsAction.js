import axios from 'axios';
import {
  STATS_LOADING,
  STATS_LOADED,
  STATS_FAIL
} from '../actions/actionTypes';
import { getErrors, clearErrors } from './errorsAction';
import { headerConfig } from './userAction';

// Load Stats
export const LoadStats = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: STATS_LOADING
    });

    const config = headerConfig(getState);

    const { data } = await axios.get('/api/stats', config);

    dispatch({
      type: STATS_LOADED,
      payload: data
    });

    dispatch(clearErrors());
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: STATS_FAIL });
  }
};

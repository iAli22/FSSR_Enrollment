import {
  USER_LOADING,
  USER_LOADED,
  USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  isAuth: null,
  user: {},
  isLoading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };

    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        user: action.payload
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: { ...action.payload },
        isAuth: true,
        isLoading: false
      };

    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case USER_FAIL:
      return {
        token: localStorage.removeItem('token'),
        isAuth: null,
        user: null,
        isLoading: false
      };

    default:
      return state;
  }
};

export default userReducer;

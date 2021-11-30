import { GET_ERRORS, CLEAR_ERRORS } from "./actionTypes";

export const getErrors = (err) => (dispatch) => {
  dispatch({
    type: GET_ERRORS,
    payload:
      err.response && err.response.data.message
        ? err.response.data.message
        : err.message,
  });
  setTimeout(() => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  }, 6000);
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

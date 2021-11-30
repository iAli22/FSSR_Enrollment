import { GET_MESSAGE, CLEAR_MESSAGE } from "./actionTypes";

export const getMessage = (message) => (dispatch) => {
  dispatch({
    type: GET_MESSAGE,
    payload: message,
  });
  setTimeout(() => {
    dispatch({
      type: CLEAR_MESSAGE,
    });
  }, 6000);
};

export const clearMessage = () => {
  return {
    type: CLEAR_MESSAGE,
  };
};

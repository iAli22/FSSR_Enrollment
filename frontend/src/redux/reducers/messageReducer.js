import { GET_MESSAGE, CLEAR_MESSAGE } from "../actions/actionTypes";

const initialState = {
  message: "",
};

const errorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGE:
      return {
        message: action.payload,
      };
    case CLEAR_MESSAGE:
      return {
        message: "",
      };
    default:
      return state;
  }
};

export default errorsReducer;

import {
	SEMESTER_LOADING,
	COURSE_LOADING,
	COURSE_LOADED,
	COURSE_CREATED,
	COURSE_UPDATED,
	COURSE_DELETED,
	COURSE_FAIL,
	LOGOUT_SUCCESS
} from "../actions/actionTypes";

const initialState = {
	course: {},
	message: "",
	isLoading: false,
	success: false
};

const courseReducer = (state = initialState, action) => {
	switch (action.type) {
		case SEMESTER_LOADING:
		case COURSE_LOADING:
			return {
				...state,
				message: "",
				isLoading: true,
				success: false
			};
		case COURSE_LOADED:
			return {
				...state,
				isLoading: false,
				message: "",
				course: action.payload,
				success: false
			};
		case COURSE_CREATED:
			return {
				...state,
				isLoading: false,
				course: action.payload,
				success: true
			};
		case COURSE_UPDATED:
			return {
				...state,
				isLoading: false,
				course: action.payload,
				success: true
			};
		case COURSE_DELETED:
			return {
				...state,
				isLoading: false,
				course: {},
				success: true
			};
		case COURSE_FAIL:
			return {
				...state,
				message: "",
				isLoading: false,
				success: false
			};
		case LOGOUT_SUCCESS:
			return initialState;
		default:
			return state;
	}
};

export default courseReducer;

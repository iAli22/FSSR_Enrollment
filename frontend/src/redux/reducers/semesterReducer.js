import {
	YEAR_LOADING,
	SEMESTER_LOADING,
	SEMESTER_LOADED,
	SEMESTER_CREATED,
	SEMESTER_UPDATED,
	SEMESTER_DELETED,
	SEMESTER_FAIL,
	LOGOUT_SUCCESS
} from "../actions/actionTypes";

const initialState = {
	semester: { semester: { courses: [], acadYear: {} } },
	message: "",
	isLoading: false,
	success: false
};

const semesterReducer = (state = initialState, action) => {
	switch (action.type) {
		case YEAR_LOADING:
		case SEMESTER_LOADING:
			return {
				...state,
				message: "",
				isLoading: true,
				success: false
			};
		case SEMESTER_LOADED:
			return {
				...state,
				isLoading: false,
				message: "",
				semester: action.payload,
				success: false
			};
		case SEMESTER_CREATED:
			return {
				...state,
				isLoading: false,
				semester: action.payload,
				success: true
			};
		case SEMESTER_UPDATED:
			return {
				...state,
				isLoading: false,
				semester: action.payload,
				success: true
			};
		case SEMESTER_DELETED:
			return {
				...state,
				isLoading: false,
				semester: {},
				success: false
			};
		case SEMESTER_FAIL:
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

export default semesterReducer;

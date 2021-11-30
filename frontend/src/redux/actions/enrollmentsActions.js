import axios from "axios";
import {
  ENROLLMENTS_ADD_COURSE,
  ENROLLMENTS_APPROVED,
  ENROLLMENTS_FAIL,
  ENROLLMENTS_LOADED,
  ENROLLMENTS_LOADING,
  ENROLLMENTS_STUDENT_LOADED,
  ENROLLMENT_COURSE_DELETED
} from "./actionTypes";
import { clearErrors, getErrors } from "./errorsAction";
import { clearMessage, getMessage } from "./messageAction";
import { headerConfig } from "./userAction";

// ! Admin Actions Enrollments
// Load Enrollment for admin
export const LoadAdminEnrollments =
  (keyword = "", page = 1, pageSize = 9) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: ENROLLMENTS_LOADING
      });

      const config = headerConfig(getState);

      const { data } = await axios.get(
        `/api/enrols?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
        config
      );

      dispatch({
        type: ENROLLMENTS_LOADED,
        payload: data
      });

      dispatch(clearErrors());
    } catch (err) {
      dispatch(getErrors(err));
      dispatch({ type: ENROLLMENTS_FAIL });
    }
  };
// get  Enrollment by user ID
export const LoadEnrollmentById = (_id) => async (dispatch) => {
  try {
    dispatch({
      type: ENROLLMENTS_LOADING
    });

    const config = headerConfig();

    const { data } = await axios.get(`/api/enrols/${_id}`, config);

    dispatch({
      type: ENROLLMENTS_STUDENT_LOADED,
      payload: data
    });

    dispatch(clearErrors());
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: ENROLLMENTS_FAIL });
  }
};

// Delete Enrollment Course
export const DeleteEnrollment =
  (enrollmentId, courseId) => async (dispatch) => {
    try {
      dispatch({
        type: ENROLLMENTS_LOADING
      });

      const config = headerConfig();

      const { data } = await axios.delete(
        `/api/enrols/${enrollmentId}/courses/${courseId}`,
        config
      );

      dispatch({
        type: ENROLLMENT_COURSE_DELETED,
        payload: data
      });

      dispatch(clearErrors());
      dispatch(getMessage("Course Deleted Successfully"));
    } catch (err) {
      dispatch(clearMessage());
      dispatch(getErrors(err));

      dispatch({ type: ENROLLMENTS_FAIL });
    }
  };

//  Approved Enrollments
export const ApproveEnrollment = (_id, isApproved) => async (dispatch) => {
  try {
    dispatch({
      type: ENROLLMENTS_LOADING
    });

    const config = headerConfig();

    const { data } = await axios.put(
      `/api/enrols/${_id}/approve`,
      isApproved,
      config
    );
    dispatch({
      type: ENROLLMENTS_APPROVED,
      payload: data
    });

    dispatch(clearErrors());
    dispatch(getMessage("Enrollment Updated Successfully"));
  } catch (err) {
    dispatch(clearMessage());
    dispatch(getErrors(err));

    dispatch({ type: ENROLLMENTS_FAIL });
  }
};

// Add Course To Enrollments
export const AddCourseToEnrollment =
  (enrollmentId, courseId) => async (dispatch) => {
    try {
      dispatch({
        type: ENROLLMENTS_LOADING
      });

      const config = headerConfig();

      const { data } = await axios.put(
        `/api/enrols/${enrollmentId}/courses/${courseId}`,
        {},
        config
      );

      dispatch({
        type: ENROLLMENTS_ADD_COURSE,
        payload: data
      });

      dispatch(clearErrors());
      dispatch(getMessage("Course Add Successfully"));
    } catch (err) {
      dispatch(clearMessage());
      dispatch(getErrors(err));

      dispatch({ type: ENROLLMENTS_FAIL });
    }
  };

// ! Students Actions Enrollments
// Load Enrollment for Students
export const LoadStudentEnrollments = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ENROLLMENTS_LOADING
    });

    const config = headerConfig(getState);

    const { data } = await axios.get(`/api/enrols/my`, config);

    dispatch({
      type: ENROLLMENTS_STUDENT_LOADED,
      payload: data
    });

    dispatch(clearErrors());
  } catch (err) {
    dispatch(getErrors(err));
    dispatch({ type: ENROLLMENTS_FAIL });
  }
};

// Select Course
export const UpdateStudentEnrollment = (courses) => async (dispatch) => {
  try {
    dispatch({
      type: ENROLLMENTS_LOADING
    });

    const config = headerConfig();

    await axios.put(`/api/enrols/my`, courses, config);

    dispatch(LoadStudentEnrollments());

    dispatch(clearErrors());
    dispatch(getMessage("Enrollment Updated Successfully"));
  } catch (err) {
    dispatch(clearMessage());
    dispatch(getErrors(err));

    dispatch({ type: ENROLLMENTS_FAIL });
  }
};

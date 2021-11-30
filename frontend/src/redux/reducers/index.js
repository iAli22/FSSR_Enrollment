import { combineReducers } from "redux";
import userReducer from "./userReducer";
import studentReducer from "./studentReducer";
import subjectReducer from "./subjectReducer";
import departmentReducer from "./departmentReducer";
import yearReducer from "./yearReducer";
import semesterReducer from "./semesterReducer";
import coursesReducer from "./coursesReducer";
import errorsReducer from "./errorsReducer";
import messageReducer from "./messageReducer";
import statsReducer from "./statsReducer";
import enrollmentsReducer from "./enrollmentsReducer";

export default combineReducers({
  user: userReducer,
  student: studentReducer,
  subject: subjectReducer,
  department: departmentReducer,
  year: yearReducer,
  semester: semesterReducer,
  course: coursesReducer,
  message: messageReducer,
  errors: errorsReducer,
  stats: statsReducer,
  enrollment: enrollmentsReducer,
});

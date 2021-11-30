import { Chip, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout } from "../../container";
import {
  AddCourseToEnrollment,
  ApproveEnrollment,
  DeleteEnrollment,
  LoadEnrollmentById,
} from "../../redux/actions/enrollmentsActions";
import { LoadSemester } from "../../redux/actions/semesterAction";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  studentContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
    marginTop: "1rem",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

function EnrollmentsDetails() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);

  const { courses, student, isApproved, _id } = useSelector(
    (state) => state.enrollment.enrollment
  );
  const semester = useSelector((state) => state.semester.semester.semester);
  const isLoading = useSelector((state) => state.enrollment.isLoading);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(LoadEnrollmentById(id));
  }, [id, LoadEnrollmentById, dispatch]);

  const approveEnrollment = (id, data) => {
    dispatch(ApproveEnrollment(id, { isApproved: data }));
  };
  const confirmDeleteCourse = (id, courseId) => {
    window.confirm("Are You Sure?") && dispatch(DeleteEnrollment(id, courseId));
  };

  const confirmAddCourse = (id, courseId) => {
    window.confirm("Are You Sure?") &&
      dispatch(AddCourseToEnrollment(id, courseId));
  };

  const onCoursesSearch = (e) => {
    e.preventDefault();

    setSearch(e.target.value);

    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        dispatch(LoadSemester("current", e.target.value));
      }, 500)
    );
  };

  return (
    <Layout>
      {!isLoading && student && (
        <div className={classes.studentContainer}>
          <div>
            <Typography variant="h6" component="p">
              Student Name: {student.fullNameEn}
            </Typography>
            <Typography variant="h6" component="p">
              Student National ID: {student.nid}
            </Typography>
          </div>

          <div>
            {isApproved ? (
              <Chip label="Approved" color="primary" />
            ) : (
              <Chip label="Not Approved" color="secondary" />
            )}

            <FormControlLabel
              style={{ marginLeft: "10px" }}
              control={
                <Checkbox
                  checked={isApproved}
                  onClick={() => approveEnrollment(_id, !isApproved)}
                  color="primary"
                />
              }
              label="Approved"
            />
          </div>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Code</TableCell>
              <TableCell align="left">title</TableCell>
              <TableCell align="left">instructor</TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              courses &&
              courses.map((enroll) => (
                <TableRow key={enroll._id}>
                  <TableCell align="left">{enroll.subject.code}</TableCell>
                  <TableCell align="left">{enroll.subject.title}</TableCell>
                  <TableCell align="left">{enroll.instructor}</TableCell>

                  <TableCell align="left">
                    <Button onClick={() => confirmDeleteCourse(id, enroll._id)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}

      <div>
        <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Courses"
            inputProps={{ "aria-label": "Search Courses" }}
            onChange={onCoursesSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onCoursesSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <Table>
          <TableBody>
            {!isLoading &&
              semester.courses &&
              semester.courses.map((enroll) => (
                <TableRow key={enroll._id}>
                  <TableCell align="left">{enroll.subject.code}</TableCell>
                  <TableCell align="left">{enroll.subject.title}</TableCell>
                  <TableCell align="left">{enroll.instructor}</TableCell>

                  <TableCell align="left">
                    <Button onClick={() => confirmAddCourse(_id, enroll._id)}>
                      <AddIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}

export default EnrollmentsDetails;

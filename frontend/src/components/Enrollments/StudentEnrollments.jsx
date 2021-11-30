import { Chip, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LoadStudentEnrollments,
  UpdateStudentEnrollment
} from "../../redux/actions/enrollmentsActions";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  studentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10px"
  },

  CardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px"
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  }
}));

function StudentEnrollments() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const isLoading = useSelector((state) => state.enrollment.isLoading);
  const dispatch = useDispatch();
  const enrollment = useSelector((state) => state.enrollment.enrollment);

  useEffect(() => {
    if (!enrollment._id) {
      dispatch(LoadStudentEnrollments());
    } else {
      setCourses(
        enrollment.courses.map((c) => {
          return { _id: c._id, selected: c.selected };
        })
      );
    }
  }, [dispatch, enrollment]);

  const onCheckChange = (index) => {
    const newSelection = courses;
    newSelection[index].selected = !newSelection[index].selected;
    setCourses([...newSelection]);
  };

  const onSubmit = () => {
    const selectionIds = courses.filter((c) => c.selected).map((c) => c._id);
    dispatch(UpdateStudentEnrollment({ courses: selectionIds }));
  };

  const onReset = () => {
    setCourses(
      enrollment.courses.map((c) => {
        return { _id: c._id, selected: c.selected };
      })
    );
  };

  return (
    <div>
      <div className={classes.topContainer}>
        <Typography variant="h6" component="p" color="textSecondary">
          Select Your Courses
        </Typography>

        <div className={classes.CardBottom}>
          <div style={{ marginRight: "1rem" }}>Request Status: </div>
          {enrollment.isApproved ? (
            <Chip label="Approved" color="primary" />
          ) : (
            <Chip label="Not Approved" color="secondary" />
          )}
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Code</TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Credit</TableCell>
              <TableCell align="left">Instructor</TableCell>
              <TableCell align="left">Current Status</TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 &&
              enrollment.courses.map((course, index) => {
                return (
                  <TableRow key={course._id}>
                    <TableCell align="left">{course.code}</TableCell>
                    <TableCell align="left">{course.title}</TableCell>
                    <TableCell align="left">{course.type}</TableCell>
                    <TableCell align="left">{course.credit}</TableCell>
                    <TableCell align="left">{course.instructor}</TableCell>
                    <TableCell align="left">
                      {course.selected ? (
                        <Chip label="Selected" color="primary" />
                      ) : (
                        <Chip label="Not Selected" color="secondary" />
                      )}
                    </TableCell>

                    <TableCell align="left">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={courses[index].selected}
                            onChange={(e) => onCheckChange(index)}
                            color="primary"
                          />
                        }
                        label="Select"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {!isLoading && (
        <div className={classes.studentContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            style={{ marginRight: "2rem" }}
          >
            Submit
          </Button>
          <Button variant="contained" color="secondary" onClick={onReset}>
            Reset
          </Button>
        </div>
      )}

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </div>
  );
}

export default StudentEnrollments;

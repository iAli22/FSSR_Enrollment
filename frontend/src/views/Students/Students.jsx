import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Pagination from "@material-ui/lab/Pagination";

import style from "./Students.module.css";
import { Layout } from "../../container";
import { LoadStudents, DeleteStudent } from "../../redux/actions/studentAction";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

function Students({
  studentsState,
  DeleteStudent,
  LoadStudents,
  isLoading,
  success
}) {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);
  const { students, page, totalPages } = studentsState;

  const confirmDeleteStudent = (id) => {
    window.confirm("Are You Sure?") && DeleteStudent(id);
  };

  useEffect(() => {
    LoadStudents();
  }, [LoadStudents, success]);

  const onStudentsSearch = (e) => {
    setSearch(e.target.value);

    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        LoadStudents(e.target.value);
      }, 500)
    );
  };

  const onPageChange = (e, v) => {
    e.preventDefault();
    LoadStudents(search, v);
  };
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <Button variant="contained" color="primary">
          <Link type="link" className={style.addBtn} to={"/students/add"}>
            Add Student
          </Link>
        </Button>

        <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Students"
            inputProps={{ "aria-label": "Search Students" }}
            onChange={onStudentsSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onStudentsSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">National ID</TableCell>
              <TableCell align="left">Department</TableCell>
              <TableCell align="left">Level</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell align="left">{student.fullNameEn}</TableCell>
                  <TableCell align="left">{student.nid}</TableCell>
                  <TableCell align="left">{student.major.name}</TableCell>
                  <TableCell align="left">{student.level}</TableCell>
                  <TableCell align="left">{student.phoneNumber}</TableCell>
                  <TableCell align="left">
                    <Button>
                      <Link
                        to={`/students/add/${student._id}`}
                        style={{
                          color: "rgba(0, 0, 0, 0.87)"
                        }}
                      >
                        <EditIcon />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Button onClick={() => confirmDeleteStudent(student._id)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && students.length > 0 && (
        <div className={style.paginate}>
          <Pagination
            count={totalPages}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            showFirstButton={true}
            shape="rounded"
            color="primary"
            onChange={onPageChange}
          />
        </div>
      )}

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  studentsState: state.student.students,
  isLoading: state.student.isLoading,
  success: state.student.success
});

export default connect(mapStateToProps, { LoadStudents, DeleteStudent })(
  Students
);

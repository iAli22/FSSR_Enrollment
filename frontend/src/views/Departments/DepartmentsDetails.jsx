import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Layout } from "../../container";
import {
  DeleteDepartmentSubject,
  LoadDepartment,
} from "../../redux/actions/departmentAction";

import { Link } from "react-router-dom";
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

function DepartmentsDetails() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);

  const { name, subjects, _id } = useSelector(
    (state) => state.department.department
  );

  const isLoading = useSelector((state) => state.department.isLoading);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(LoadDepartment(id));
  }, [id, LoadDepartment, dispatch]);

  const confirmDeleteSubject = (subjectId) => {
    window.confirm("Are You Sure?") &&
      dispatch(DeleteDepartmentSubject(id, subjectId));
  };

  return (
    <Layout>
      {!isLoading && subjects && (
        <div className={classes.studentContainer}>
          <div>
            <Typography variant="h6" component="p">
              Department Name: {name}
            </Typography>
            <Typography variant="h6" component="p"></Typography>
          </div>

          <Button variant="contained" color="primary">
            <Link
              to={`/departments/subject/${id}`}
              style={{
                color: "#FFF",
              }}
            >
              Add new Subject
            </Link>
          </Button>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Code</TableCell>
              <TableCell align="left">title</TableCell>
              <TableCell align="left">level</TableCell>
              <TableCell align="left">type</TableCell>
              <TableCell align="center" colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              subjects &&
              subjects.map((subject) => (
                <TableRow key={subject.subject?._id}>
                  <TableCell align="left">{subject.subject?.code}</TableCell>
                  <TableCell align="left">{subject.subject?.title}</TableCell>
                  <TableCell align="left">{subject.level}</TableCell>
                  <TableCell align="left">{subject.type}</TableCell>

                  <TableCell align="left">
                    <Button
                      onClick={() => confirmDeleteSubject(subject.subject._id)}
                    >
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
    </Layout>
  );
}

export default DepartmentsDetails;

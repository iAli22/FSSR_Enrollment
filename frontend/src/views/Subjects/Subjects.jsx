import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Pagination from "@material-ui/lab/Pagination";

import style from "./Subjects.module.css";
import { Layout } from "../../container";
import { LoadSubjects, DeleteSubject } from "../../redux/actions/subjectAction";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  inputContainer: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 250,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

function Subjects({
  subjectsState,
  DeleteSubject,
  LoadSubjects,
  isLoading,
  success,
}) {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [counter, setCounter] = useState(null);
  const { subjects, page, totalPages } = subjectsState;

  const confirmDeleteSubject = (id) => {
    window.confirm("Are You Sure?") && DeleteSubject(id);
  };

  useEffect(() => {
    LoadSubjects();
  }, [LoadSubjects, success]);

  const onSubjectsSearch = (e) => {
    setSearch(e.target.value);

    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        LoadSubjects(e.target.value);
      }, 500)
    );
  };

  const onPageChange = (e, v) => {
    e.preventDefault();
    LoadSubjects(search, v);
  };

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Button variant="contained" color="primary">
          <Link type="link" className={style.addBtn} to={"/subjects/add"}>
            Add Subject
          </Link>
        </Button>

        <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Subjects"
            inputProps={{ "aria-label": "Search Subjects" }}
            onKeyUp={onSubjectsSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onSubjectsSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          subjects.map((subject) => (
            <Grid item md={4} key={subject._id}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography variant="h5" component="p" color="textSecondary">
                    {subject.code}
                  </Typography>
                  <Typography variant="h6" component="p">
                    {subject.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button>
                    <Link
                      to={`/subjects/add/${subject._id}`}
                      style={{
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      <EditIcon />
                    </Link>
                  </Button>

                  <Button onClick={() => confirmDeleteSubject(subject._id)}>
                    <DeleteIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!isLoading && subjects.length > 0 && (
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
  subjectsState: state.subject.subjects,
  isLoading: state.subject.isLoading,
  success: state.subject.success,
});

export default connect(mapStateToProps, { LoadSubjects, DeleteSubject })(
  Subjects
);

import React, { useEffect, useState } from "react";
import { Layout } from "../../container";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import style from "./Departments.module.css";
import { connect } from "react-redux";
import {
  LoadDepartments,
  DeleteDepartment,
} from "../../redux/actions/departmentAction";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

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

function Departments({
  departments,
  DeleteDepartment,
  LoadDepartments,
  isLoading,
}) {
  const classes = useStyles();
  const [counter, setCounter] = useState(null);

  const confirmDeleteDepartment = (id) => {
    window.confirm("Are You Sure?") && DeleteDepartment(id);
  };

  useEffect(() => {
    LoadDepartments();
  }, [LoadDepartments]);

  const onDepartmentsSearch = (e) => {
    if (counter) {
      clearTimeout(counter);
    }
    setCounter(
      setTimeout(() => {
        LoadDepartments(e.target.value);
      }, 500)
    );
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
          <Link type="link" className={style.addBtn} to={"/departments/add"}>
            Add Department
          </Link>
        </Button>

        <Paper component="form" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Search Departments"
            inputProps={{ "aria-label": "Search Departments" }}
            onChange={onDepartmentsSearch}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={onDepartmentsSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>

      <Grid container className={classes.root} spacing={2}>
        {!isLoading &&
          departments.map((department) => (
            <Grid item md={4} key={department._id}>
              <Card className={classes.root}>
                <Link
                  to={`/departments/show/${department._id}`}
                  style={{
                    color: "rgba(0, 0, 0, 0.87)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="p"
                      color="textSecondary"
                    >
                      {department.name}
                    </Typography>
                  </CardContent>
                </Link>
                <CardActions>
                  <Button>
                    <Link
                      to={`/departments/add/${department._id}`}
                      style={{
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      <EditIcon />
                    </Link>
                  </Button>

                  <Button
                    onClick={() => confirmDeleteDepartment(department._id)}
                  >
                    <DeleteIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  departments: state.department.departments,
  isLoading: state.department.isLoading,
});

export default connect(mapStateToProps, { LoadDepartments, DeleteDepartment })(
  Departments
);

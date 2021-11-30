import { CircularProgress, Grid, Typography } from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import PeopleIcon from "@material-ui/icons/People";
import ScheduleIcon from "@material-ui/icons/Schedule";
import React, { useEffect } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import "../App.css";
import { Layout } from "../container";
import { LoadStats } from "../redux/actions/statsAction";

function Home({ LoadStats, statsState }) {
  useEffect(() => {
    LoadStats();
  }, [LoadStats]);

  return (
    <Layout>
      <Typography
        variant="h2"
        component="h2"
        color="textPrimary"
        style={{
          marginBottom: "3rem",
        }}
      >
        Welcome to FSSR Enrollment System
      </Typography>

      {!statsState.isLoading && (
        <Grid container spacing={2}>
          <Grid item xs={6} className="numberContainer">
            <ScheduleIcon />
            <h5>
              Number : {statsState.stats.currentSemester.name}
              <br />
              Start Date{" "}
              <Moment format="YYYY/MM/DD">
                {statsState.stats.currentSemester.startDate}
              </Moment>
              <br />
              End Date :{" "}
              <Moment format="YYYY/MM/DD">
                {statsState.stats.currentSemester.endDate}
              </Moment>
            </h5>
            <Typography variant="h6" component="h5" color="textSecondary">
              Current Semester
            </Typography>
          </Grid>

          <Grid item xs={6} className="numberContainer">
            <AccountBalanceIcon />
            <h4>{statsState.stats.departCount}</h4>
            <Typography variant="h6" component="h5" color="textSecondary">
              Number Of Departments
            </Typography>
          </Grid>

          <Grid item xs={6} className="numberContainer">
            <LibraryBooksIcon />
            <h4>{statsState.stats.courseCount}</h4>

            <Typography variant="h6" component="h5" color="textSecondary">
              Number Of Courses
            </Typography>
          </Grid>

          <Grid item xs={6} className="numberContainer">
            <PeopleIcon />
            <h4>{statsState.stats.enroledStdCount}</h4>
            <Typography variant="h6" component="h5" color="textSecondary">
              Number Of Students
            </Typography>
          </Grid>
        </Grid>
      )}

      {statsState.isLoading && (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  statsState: state.stats,
});

export default connect(mapStateToProps, {
  LoadStats,
})(Home);

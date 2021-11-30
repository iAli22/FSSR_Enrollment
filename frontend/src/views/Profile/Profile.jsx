import { Avatar, CircularProgress, Grid, Typography } from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ContactsIcon from "@material-ui/icons/Contacts";
// Icons
import EmailIcon from "@material-ui/icons/Email";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import SchoolIcon from "@material-ui/icons/School";
import React, { useEffect } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Layout } from "../../container";
import { LoadUser } from "../../redux/actions/userAction";
import style from "./Profile.module.css";

function Profile({ user, isLoading, LoadUser }) {
  useEffect(() => {
    LoadUser();
  }, [LoadUser]);
  return (
    <Layout>
      {user.nid ? (
        <div className={style.profileContainer}>
          <Avatar src={user.photo} className={style.profileAvatar}></Avatar>
          <div className={style.profileMain}>
            <Typography variant="h5" component="p">
              {user.name}
            </Typography>
            <Typography variant="h6" component="p" color="textSecondary">
              {user.role}
            </Typography>
          </div>

          <Grid container spacing={2} className={style.profileGrid}>
            <Grid item md={6} className={style.gridItem}>
              <PersonIcon />
              <span>{user.fullNameEn}</span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <EmailIcon />
              <span>{user.email}</span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <PhoneIcon />
              <span>{user.phoneNumber}</span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <SchoolIcon />
              <span>
                {user.degree} - {user.gradYear}
              </span>
            </Grid>

            <Grid item md={6} className={style.gridItem}>
              <CalendarTodayIcon />
              <span>
                <Moment format="YYYY/MM/DD">{user.birthday}</Moment>
              </span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <ContactsIcon />
              <span>NID: {user.nid}</span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <LocalLibraryIcon />
              <span>{user.major.name}</span>
            </Grid>
            <Grid item md={6} className={style.gridItem}>
              <EmailIcon />
              <span> Semster :{user.level} </span>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <CircularProgress disableShrink />
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.user.isLoading,
});

export default connect(mapStateToProps, { LoadUser })(Profile);

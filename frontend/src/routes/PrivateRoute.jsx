import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, useHistory } from "react-router-dom";
import { LoadUser } from "../redux/actions/userAction";
function PrivateRoute({
  component: Component,
  LoadUser,
  userState,
  isAdmin,
  ...rest
}) {
  const history = useHistory();

  useEffect(() => {
    if (!userState || Object.keys(userState).length == "") {
      LoadUser();
    } else if (isAdmin && userState.role !== "admin") {
      history.push("/");
    }
  }, [userState, isAdmin, LoadUser, history]);

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

const mapStateToProps = (state) => ({
  userState: state.user.user,
});

export default connect(mapStateToProps, { LoadUser })(PrivateRoute);

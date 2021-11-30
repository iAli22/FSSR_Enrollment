import React from "react";
import { useSelector } from "react-redux";
import { Layout } from "../../container";
import { AdminEnrollments, StudentEnrollments } from "../../components";
import { isEmpty } from "../../helper";

function Enrollments() {
  const user = useSelector((state) => state.user.user);

  const renderEnrollment = () => {
    if (!isEmpty(user) && user.role === "admin") {
      return <AdminEnrollments />;
    } else if (!isEmpty(user) && user.role === "student") {
      return <StudentEnrollments />;
    }
  };

  return <Layout>{renderEnrollment()}</Layout>;
}

export default Enrollments;

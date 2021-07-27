import React, { useState } from "react";
import M from "materialize-css";
import { Formik, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import * as Yup from "yup";
import { userUpdateprofile } from "../store/actions/post";

const Profileupdate = (props) => {
  const [UpdatePhoto, setUpdatePhoto] = useState("");
  const [UpdatedId, setUpdatedId] = useState("");
  const history = useHistory();

  const updateData = (e) => {
    e.preventDefault();
    let formData = new FormData();
    console.log("dszjfbdsvf");
    formData.append("Photo", UpdatePhoto);
    console.log(UpdatePhoto);
    props.userUpdateprofile(UpdatedId, formData, history);
  };

  return (
    <div className="mycard">
      <form onSubmit={(e) => updateData(e)}>
        <div className="card auth-card imput-field">
          <br />
          <h2 style={{ fontWeight: "bolder", color: "#3A5B91" }}>
            Edit profile
          </h2>
          <div className="file-field input-field">
            <div className="btn" style={{ background: "#3A5B91" }}>
              <span>Image</span>
              <input
                type="file"
                onChange={(e) => setUpdatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <br />
          <br />
          <button
            className="btn waves-effect waves-light"
            type="submit"
            style={{ background: "#3A5B91" }}
            name="action"
          >
            Edit post
          </button>
          <br />
          <br />
          <br />
        </div>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.AuthReducers.showLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userUpdateprofile: (id, data, history) =>
      dispatch(userUpdateprofile(id, data, history)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profileupdate)
);

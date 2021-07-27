import React, { useState } from "react";
import M from "materialize-css";
import { Formik, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import * as Yup from "yup";
import { AddPost } from "../store/actions/post";

const AddPos = (props) => {
  const [Photo, setPhoto] = useState(null);
  const history = useHistory();

  const postdata = (fields) => {
    let formData = new FormData();
    formData.append("Title", fields.Title);
    formData.append("Body", fields.Body);
    formData.append("Photo", Photo);
    props.AddPost(formData, history);
  };

  return (
    <div>
      <Formik
        initialValues={{
          Title: "",
          Body: "",
        }}
        validationSchema={Yup.object().shape({
          Title: Yup.string().required("Username is required"),
          Body: Yup.string().required("Password is required"),
        })}
        onSubmit={(fields) => {
          M.toast({ html: "add post successfuly", classes: "green" });
          postdata(fields);
        }}
        render={({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="mycard">
            <form method="post" onSubmit={handleSubmit}>
              <div className="card auth-card imput-field">
                <br />
                <h2 style={{ fontWeight: "bolder", color: "#3A5B91" }}>
                  Add post
                </h2>
                <Field
                  name="Title"
                  type="text"
                  value={values.Title}
                  onChange={handleChange}
                  placeholder="Title"
                  className={
                    "form-control" +
                    (errors.Title && touched.Title ? " is-invalid" : "")
                  }
                />
                <font color="red">
                  <ErrorMessage
                    name="Title"
                    component="div"
                    className="invalid-feedback"
                  />
                </font>
                <br />
                <Field
                  name="Body"
                  type="text"
                  value={values.Body}
                  onChange={handleChange}
                  placeholder="Body"
                  className={
                    "form-control" +
                    (errors.Body && touched.Body ? " is-invalid" : "")
                  }
                />
                <font color="red">
                  <ErrorMessage
                    name="Body"
                    component="div"
                    className="invalid-feedback"
                  />
                </font>
                <div className="file-field input-field">
                  <div className="btn" style={{ background: "#3A5B91" }}>
                    <span>Image</span>
                    <input
                      type="file"
                      onChange={(e) => setPhoto(e.target.files[0])}
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
                  Add post
                </button>
                <br />
                <br />
                <br />
              </div>
            </form>
          </div>
        )}
      />
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
    AddPost: (data, history) => dispatch(AddPost(data, history)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPos));

import React, { useState } from "react";
import { Field, Formik, ErrorMessage } from "formik";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { userSignup } from "../store/actions/auth";
import * as Yup from "yup";
import M from "materialize-css";

const Signup = (props) => {
  const [Photo, setPhoto] = useState(null);

  const history = useHistory();

  const myfunction = () => {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const senddata = (fields) => {
    console.log("Photo", Photo);
    let formData = new FormData();

    formData.append("Firstname", fields.Firstname);
    formData.append("Lastname", fields.Lastname);
    formData.append("Email", fields.Email);
    formData.append("Username", fields.Username);
    formData.append("Photo", Photo);
    formData.append("Password", fields.Password);
    formData.append("Cpassword", fields.Cpassword);
    props.userSignup(formData, history);
  };

  return (
    <React.Fragment>
      <div>
        <Formik
          initialValues={{
            Firstname: "",
            Lastname: "",
            Email: "",
            Username: "",
            Password: "",
            Cpassword: "",
          }}
          validationSchema={Yup.object().shape({
            Firstname: Yup.string().required("Firstname is required"),
            Lastname: Yup.string().required("Lastname is required"),
            Email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            Username: Yup.string().required("Username is required"),
            Password: Yup.string()
              .min(6, "Password must be at least 6 characters.")
              .required("Password is required"),
            Cpassword: Yup.string()
              .oneOf([Yup.ref("Password"), null], "Passwords must match")
              .required("confirm password is required"),
          })}
          onSubmit={(fields) => {
            M.toast({ html: "successfuly registred", classes: "green" });
            senddata(fields);
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
                    Sign up
                  </h2>
                  <Field
                    name="Firstname"
                    type="text"
                    value={values.Firstname}
                    onChange={handleChange}
                    placeholder="Firstname"
                    className={
                      "form-control" +
                      (errors.Firstname && touched.Firstname
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Firstname"
                      component="div"
                      className="invalid-feedback"
                    />
                  </font>
                  <br />
                  <Field
                    name="Lastname"
                    type="text"
                    value={values.Lastname}
                    onChange={handleChange}
                    placeholder="Lastname"
                    className={
                      "form-control" +
                      (errors.Lastname && touched.Lastname ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Lastname"
                      component="div"
                      className="invalid-feedback"
                    />
                  </font>
                  <br />
                  <Field
                    name="Email"
                    type="text"
                    value={values.Email}
                    placeholder="Email"
                    onChange={handleChange}
                    className={
                      "form-control" +
                      (errors.Email && touched.Email ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Email"
                      component="div"
                      className="invalid-feedback "
                    />
                  </font>
                  <br />
                  <Field
                    name="Username"
                    type="text"
                    value={values.Username}
                    placeholder="Username"
                    onChange={handleChange}
                    className={
                      "form-control" +
                      (errors.Username && touched.Username ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Username"
                      component="div"
                      className="invalid-feedback "
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
                  <Field
                    name="Password"
                    id="myInput"
                    type="password"
                    placeholder="Password"
                    value={values.Password}
                    onChange={handleChange}
                    className={
                      "form-control" +
                      (errors.Password && touched.Password ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Password"
                      component="div"
                      className="invalid-feedback "
                    />
                  </font>
                  <br />
                  <p>
                    <label>
                      <input type="checkbox" onClick={myfunction} />
                      <span>show password</span>
                    </label>
                  </p>

                  <Field
                    name="Cpassword"
                    type="password"
                    placeholder="Confirm password"
                    values={values.Cpassword}
                    className={
                      "form-control" +
                      (errors.Cpassword && touched.Cpassword
                        ? " is-invalid"
                        : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Cpassword"
                      component="div"
                      className="invalid-feedback "
                    />
                  </font>
                  <br />
                  <br />
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    style={{ background: "#3A5B91" }}
                    name="action"
                  >
                    Sign up
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
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.AuthReducers.showLoginModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userSignup: (data, history) => dispatch(userSignup(data, history)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));

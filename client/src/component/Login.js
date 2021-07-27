import React from "react";
import { Field, Formik, ErrorMessage } from "formik";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Userlogin } from "../store/actions/auth";
import * as Yup from "yup";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
const Login = (props) => {
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
    props.Userlogin(
      {
        Username: fields.Username,
        Password: fields.Password,
      },
      history
    );
  };
  console.log(process.env.REACT_APP_NODE_API);
  return (
    <React.Fragment>
      <div>
        <Formik
          initialValues={{
            Username: "",
            Password: "",
          }}
          validationSchema={Yup.object().shape({
            Username: Yup.string().required("Username is required"),
            Password: Yup.string().required("Password is required"),
          })}
          onSubmit={(fields) => {
            M.toast({ html: "successfuly login", classes: "green" });
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
                    Login
                  </h2>
                  <Field
                    name="Username"
                    type="text"
                    value={values.Username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={
                      "form-control" +
                      (errors.Username && touched.Username ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Username"
                      component="div"
                      className="invalid-feedback"
                    />
                  </font>
                  <br />
                  <Field
                    name="Password"
                    id="myInput"
                    type="password"
                    value={values.Password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={
                      "form-control" +
                      (errors.Password && touched.Password ? " is-invalid" : "")
                    }
                  />
                  <font color="red">
                    <ErrorMessage
                      name="Password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </font>
                  <br />
                  <p>
                    <label>
                      <input type="checkbox" onClick={myfunction} />
                      <span>show password</span>
                    </label>
                  </p>
                  <br />
                  <br />
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    style={{ background: "#3A5B91" }}
                    name="action"
                  >
                    Login
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
    Userlogin: (data, history) => dispatch(Userlogin(data, history)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

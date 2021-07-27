import React, { useEffect, useState } from "react";
import { withRouter, useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";
import { Logout } from "../store/actions/auth";
import Axios from "axios";
import {AllPost} from '../store/actions/post';

const Navbar = (props) => {
  const history = useHistory();
  const [SearchUser, setSearchUser] = useState([]);

  const [ active , setActive ] = useState(false)

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_NODE_API}/search`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setSearchUser(res.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const logout = () => {
    props.Logout(history);
  };

  function myFunction(data) {
    if(data !== ''){
      setActive(true)
    }
    else{
      setActive(false)
    }
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  return (
    <div>
      <div className="row" style={{ width: "100%" }}>
        <div className="s12 m12 l12">
          <nav>
            <div className="nav-wrapper white">
              <React.Fragment>
                {localStorage.getItem("jwt") ? (
                  <Link to="/">
                    <img
                      src="https://www.waldorfgarden.org/wp-content/uploads/2019/04/facebook-logo-circle-new.png"
                      alt="mypic"
                      style={{ width: "80   px", height: "60px" }}
                    />
                  </Link>
                ) : (
                  <img
                    src="https://www.waldorfgarden.org/wp-content/uploads/2019/04/facebook-logo-circle-new.png"
                    alt="mypic"
                    style={{ width: "80   px", height: "60px" }}
                  />
                )}
                {localStorage.getItem("jwt") ? (
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                      <input
                        type="search"
                        id="myInput"
                        onKeyUp={(e) => myFunction(e.target.value)}
                        placeholder="Search......."
                        title="Type in a"
                      />
                      <ul id="myUL">
                        {SearchUser.data &&
                          SearchUser.data &&
                          SearchUser.data.map((item) => {
                            return (
                              <React.Fragment>
                                <div style={{position:'absolute'}}>
                                  {active ? 
                                  JSON.parse(
                                    localStorage.getItem("username")
                                  ) === item.Username ? null : (
                                    <div
                                      id="d1"
                                      style={{
                                        background: "#E6F1E5",
                                        width: "100%",
                                        display: "table",
                                      }}
                                    > 
                                          <li
                                        style={{ float: "none", clear: "both" }}
                                      >
                                          <Link to={`/Userprofile?Id:${item._id}`} className="search__list" onBlur={() => {active = !active}}>{item.Username}</Link>
                                      </li>
                                      
                                    </div>
                                  )
                                  : ''}
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </ul>
                    </li>
                    <li>
                      <Link to="/Profile">
                        <button
                          className="btn waves-effect waves-light"
                          style={{ marginRight: "12px", background: "#3A5B91" }}
                          type="submit"
                          name="action"
                        >
                          Profile
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Addpost">
                        <button
                          className="btn waves-effect waves-light"
                          style={{ marginRight: "12px", background: "#3A5B91" }}
                          type="submit"
                          name="action"
                        >
                          Add post
                        </button>
                      </Link>
                    </li>
                    <li>
                      <button
                        className="btn waves-effect waves-light"
                        onClick={logout}
                        style={{ marginRight: "12px", background: "#3A5B91" }}
                        type="submit"
                        name="action"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                      <Link to="/Login">
                        <button
                          className="btn waves-effect waves-light"
                          style={{ marginRight: "12px", background: "#3A5B91" }}
                          type="submit"
                          name="action"
                        >
                          Login
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/Signup">
                        <button
                          className="btn waves-effect waves-light"
                          style={{ marginRight: "12px", background: "#3A5B91" }}
                          type="submit"
                          name="action"
                        >
                          Signup
                        </button>
                      </Link>
                    </li>
                  </ul>
                )}
              </React.Fragment>
            </div>
          </nav>
        </div>
      </div>
  
    </div>
  );
};

function mapStateToProps(state) {
  return {
    postList: state.PostReducers.postList,
    isLoggedIn: state.AuthReducers.isLoggedIn,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    Logout: (history) => dispatch(Logout(history)),
    AllPost: () => dispatch(AllPost()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));

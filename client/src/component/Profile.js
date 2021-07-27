import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Mypost, Myposts, AllPost } from "../store/actions/post";
import Notification from "./Notification";

const Profile = (props) => {
  const [Page, setPage] = useState("mypost");
  useEffect(() => {
    props.Mypost();
    props.Myposts();
    props.AllPost();
  }, []);
  const myPostpage = () => {
    setPage("mypost");
  };

  const myNotificationpage = () => {
    setPage("notification");
  };

  

  return (
    <div>
      <div class="col s12 m6">
        <div
          class="card"
          style={{ width: "35%", margin: "0 auto", display: "table" }}
        >
          <div class="card-content">
            {props.myPosts.data ? (
              <React.Fragment>
                <div style={{ float: "left", width: "40%" }}>
                  <img
                    src={`http://localhost:3001/public/${props.myPosts.data.Photo}`}
                    alt="mypic"
                    maxWidth="15%"
                    height="150px"
                    style={{ borderRadius: "100%" }}
                  />
                  <i
                    class="material-icons"
                    style={{
                      position: "absolute",
                      marginTop: "120px",
                      marginRight: "5x0px",
                    }}
                  >
                    <Link to="/Profileupdate">edit</Link>
                  </i>
                </div>
                <div
                  style={{
                    marginLeft: "100px",
                    width: "60%",
                    alignItems: "center",
                  }}
                >
                  <h5 style={{ marginLeft: "30px" }}>
                    {props.myPosts.data.Firstname} {props.myPosts.data.Lastname}
                  </h5>
                  <h6>{props.myPosts.data.Email}</h6>
                  <br />
                  <div>
                    <h6 style={{ float: "left", marginLeft: "30px" }}>
                      Followers
                    </h6>
                    <h6 style={{ float: "left", marginLeft: "15px" }}>Following</h6>
                    <h6 style={{ float: "left", marginLeft: "350px", marginTop:'12px',position:'absolute' }}>Posts</h6>
                    <h6 style={{ float: "left", marginLeft: "50px" }}>
                      {props.myPosts.data.Followers.length }
                    </h6>
                    <h6 style={{ float: "left", marginLeft: "90px" }}>
                      {props.myPosts.data.Following.length }
                    </h6>
                    <span>
                      <h6 style={{ float: "left",position:'absolute' ,marginLeft: "360px",marginTop:'48px' }}>
                        {props.myPost &&
                          props.myPost.data &&
                          props.myPost.data.length}
                      </h6>
                    </span>
                    <br />
                    <br />
                    <br />
                    <br />
                    <button
                      onClick={() => myPostpage()}
                      className="btn waves-effect waves-light"
                      type="submit"
                      style={{
                        background: "#3A5B91",
                        float: "left",
                        marginLeft: "150px",
                      }}
                      name="action"
                    >
                      My Post
                    </button>
                    <button
                      onClick={() => myNotificationpage()}
                      className="btn waves-effect waves-light"
                      type="submit"
                      style={{
                        background: "#3A5B91",
                        float: "left",
                        position: "absolute",
                        marginLeft: "30px",
                      }}
                      name="action"
                    >
                      Notificatoin
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </div>
          <br />
          <br />
          <hr color="gray" />
          {Page === "mypost" ? (
            <div>
              {props.myPost.data &&
                Object.values(props.myPost.data).map((item, index) => {
                  return (
                    <React.Fragment>
                      <img
                        src={`http://localhost:3001/public/${item.Photo}`}
                        alt="mypic"
                        style={{
                          borderRadius: "5%",
                          width: "190px",
                          height: "200px",
                          marginLeft: "18px",
                        }}
                      />
                    </React.Fragment>
                  );
                })}
            </div>
          ) : (
            <Notification />
          )}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    myPost: state.PostReducers.myPost,
    myPosts: state.PostReducers.myPosts,
    postList: state.PostReducers.postList,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    Mypost: () => dispatch(Mypost()),
    Myposts: () => dispatch(Myposts()),
    AllPost: () => dispatch(AllPost()),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);

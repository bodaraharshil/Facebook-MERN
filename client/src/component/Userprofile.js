import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import M from "materialize-css";
import { withRouter } from "react-router-dom";
import { AllPost, Myposts, Postdelete, Mypost } from "../store/actions/post";

const Userprofile = (props) => {
  const [follow, setfollow] = useState(true);
  const [unfollow, setunfollow] = useState(true);

  useEffect(() => {
    props.Mypost();
    props.AllPost();
    props.Myposts();
  }, []);

  const id = window.location.search.replace("?Id:", "");
  const userpost = props.allpost.filter((post) => post.Postedby._id === id);

  const followrequest = (userid) => {
    setfollow(false);
    axios
      .post(
        `${process.env.REACT_APP_NODE_API}/follow`,
        {
          followId: userid,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        M.toast({ html: res.data.message, classes: "green" });
      })
      .catch(() => {
        M.toast({ html: "some error", classes: "red" });
      });
  };

  const unfollowrequest = (userid) => {
    setfollow(true);
    axios
      .post(
        `${process.env.REACT_APP_NODE_API}/unfollow`,
        {
          unfollowId: userid,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        M.toast({ html: res.data.message, classes: "green" });
      })
      .catch(() => {
        M.toast({ html: "some error", classes: "red" });
      });
  };

  return (
    <div>
      <div class="col s12 m6">
        <div
          class="card"
          style={{ width: "35%", margin: "0 auto", display: "table" }}
        >
          <div class="card-content">
            {userpost.map((item) => {
              return (
                <React.Fragment>
                  <div style={{ float: "left", width: "40%" }}>
                    <img
                      src={`http://localhost:3001/public/${item.Postedby.Photo}`}
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
                    ></i>
                  </div>
                  <div
                    style={{
                      marginLeft: "100px",
                      width: "60%",
                      alignItems: "center",
                    }}
                  >
                    <h5 style={{ marginLeft: "30px" }}>
                      {item.Postedby.Username}
                    </h5>
                    <h6>{item.Postedby.Email}</h6>
                    <br />
                    <div>
                      <h6 style={{ float: "left", marginLeft: "30px" }}>
                        Friends
                      </h6>
                      <h6 style={{ float: "left", marginLeft: "50px" }}>
                        Posts
                      </h6>
                      <h6 style={{ float: "left", marginLeft: "50px" }}>
                        {props.myPosts.data.Following.length}
                      </h6>
                      <h6 style={{ float: "left", marginLeft: "100px" }}>
                        {" "}
                        {props.myPost &&
                          props.myPost.data &&
                          props.myPost.data.length}
                      </h6>
                      <br />
                      <br />
                      <br />
                      <br />
                      {follow ? (
                        <button
                          className="btn waves-effect waves-light"
                          onClick={() => followrequest(item.Postedby._id)}
                          type="submit"
                          style={{
                            background: "#3A5B91",
                            float: "left",
                            marginLeft: "200px",
                          }}
                          name="action"
                        >
                          Follow
                        </button>
                      ) : (
                        <button
                          className="btn waves-effect waves-light"
                          type="submit"
                          onClick={() => unfollowrequest(item.Postedby._id)}
                          style={{
                            background: "#3A5B91",
                            float: "left",
                            marginLeft: "200px",
                            position: "absolute",
                            marginBottom: "180px",
                          }}
                          name="action"
                        >
                          UnFollow
                        </button>
                      )}
                    </div>
                    {console.log(
                      "myPostsmyPostsmyPosts",
                      props.myPosts.data.Followers
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <br />
          <br />
          <br />
          <hr color="gray" />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    postList: state.PostReducers.postList,
    myPost: state.PostReducers.myPost,
    myPosts: state.PostReducers.myPosts,
    allpost: state.PostReducers.postList.data,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    AllPost: () => dispatch(AllPost()),
    Mypost: () => dispatch(Mypost()),
    Myposts: () => dispatch(Myposts()),
    Postdelete: (postId, history) => dispatch(Postdelete(postId, history)),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Userprofile)
);

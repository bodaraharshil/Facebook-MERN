import React, { useEffect, useState } from "react";
import { AllPost, Myposts, Postdelete } from "../store/actions/post";
import { UserContext } from "../App";
import M from "materialize-css";
import Axios from "axios";
import Avtar from "react-avatar";
import { connect } from "react-redux";
import "../App.css";
import { useHistory, withRouter, Link } from "react-router-dom";

const Home = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [Followers, setFollowers] = useState([]);
  const [Following, setFollowing] = useState([]);

  useEffect(() => {
    props.AllPost();
    props.Myposts();
    Axios.get(`${process.env.REACT_APP_NODE_API}/search`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setFollowers(res.data);
        setFollowing(res.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const postdelete = (postId) => {
    props.Postdelete(postId);
    props.AllPost();
    props.Myposts();
  };

  const like = (id) => {
    {
      console.log(id);
    }
    fetch(
      `${process.env.REACT_APP_NODE_API}/like`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      {
        body: JSON.stringify({
          postId: id,
        }),
      }
    )
      .then((res) => res.json(res))
      .then((result) => {
        // console.log(data);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unlike = (id) => {
    fetch(
      `${process.env.REACT_APP_NODE_API}/unlike`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      {
        body: JSON.stringify({
          postId: id,
        }),
      }
    )
      .then((res) => res.json(res))
      .then((result) => {
        // console.log(data);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const makecomment = (text, postId) => {
    console.log("text,postId", text, postId);
    fetch(`${process.env.REACT_APP_NODE_API}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    });
  };

  const user = localStorage.getItem("username");
  return (
    <React.Fragment>
          { props.postList      && props.postList.data && Object.values(props.postList.data).map((item)=>{
        return(
          <React.Fragment>
            {JSON.parse(localStorage.getItem("username")) === item.Postedby.Username ?
             (
              <React.Fragment>
              <div class="col s12 m6">
                <div
                  class="card"
                  style={{
                    width: "25%",
                    margin: "0 auto",
                    display: "table",
                  }}
                >
                  <div class="card-content">
                    <Avtar
                      src={`http://localhost:3001/public/${item.Postedby.Photo}`}
                      size="45"
                      round={true}
                      style={{ float: "left" }}
                    />
                    <span
                      class="card-title"
                      style={{
                        fontWeight: "bold",
                        marginLeft: "20px",
                      }}
                    >
                      &nbsp;&nbsp;
                      {item.Postedby.Username}
                    </span>
                    <br />
                    <h6>{item.Body}</h6>
                    <br/>
                    <img
                      src={`http://localhost:3001/public/${item.Photo}`}
                      alt="mypic"
                      Width="100%"
                      height="300px"
                    />
                    <div
                      style={{
                        marginLeft: "20px",
                        borderTop: "2px gray solid",
                      }}
                    >
                      <div class="card-action">
                        <b
                          style={{ fontSize: "25px" }}
                        >
                          0&nbsp;:
                        </b>
                        <i
                          class="material-icons"
                          style={{
                            marginLeft: "20px",
                            marginTop: "20px",
                          }}
                        >
                          thumb_down
                        </i>

                        <i
                          class="material-icons"
                          style={{
                            marginLeft: "10px",
                            marginTop: "20px",
                          }}
                        >
                          thumb_up
                        </i>
                        <br />
                        <form>
                          <input
                            type="text"
                            placeholder="Add a comment"
                            name="text"
                            style={{ width: "350px" }}
                          />
                          <button
                            style={{
                              width: "60px",
                              lineHeight: "30px",
                              outline: "0",
                              borderRadius: "5px",
                              color: "white",
                              borderColor: "green",
                              background: "green",
                            }}
                          >
                            {" "}
                            Add
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
             )
            :
              null
            }
          </React.Fragment>
        )
      })
      }
          {Followers.data ? (
        <React.Fragment>
          {Followers.data.map((test) => {
            return (
              <React.Fragment>
                {test.Followers.map((accept) => {
                  return (
                    <React.Fragment>
                      {console.log(accept.accept == 1)}
                      <div>
                        {accept.accept == 1 ? (
                          <React.Fragment>
                            {props.postList.data &&
                              props.postList.data &&
                              props.postList.data.map((posts) => {
                                return (
                                  <React.Fragment>
                                    {accept.request_by ===
                                    posts.Postedby._id && (props && props.myPosts.data._id !== posts.Postedby._id)   ?  (
                                      <React.Fragment>
                                        <div class="col s12 m6">
                                          <div
                                            class="card"
                                            style={{
                                              width: "25%",
                                              margin: "0 auto",
                                              display: "table",
                                            }}
                                          >
                                            <div class="card-content">
                                              <Avtar
                                                src={`http://localhost:3001/public/${posts.Postedby.Photo}`}
                                                size="45"
                                                round={true}
                                                style={{ float: "left" }}
                                              />
                                              <span
                                                class="card-title"
                                                style={{
                                                  fontWeight: "bold",
                                                  marginLeft: "20px",
                                                }}
                                              >
                                                &nbsp;&nbsp;
                                                {posts.Postedby.Username}
                                              </span>
                                              <br />
                                              <h6>{posts.Body}</h6>
                                              <br/>
                                              <img
                                                src={`http://localhost:3001/public/${posts.Photo}`}
                                                alt="mypic"
                                                Width="100%"
                                                height="300px"
                                              />
                                              <div
                                                style={{
                                                  marginLeft: "20px",
                                                  borderTop: "2px gray solid",
                                                }}
                                              >
                                                <div class="card-action">
                                                  <b
                                                    style={{ fontSize: "25px" }}
                                                  >
                                                    0&nbsp;:
                                                  </b>
                                                  <i
                                                    class="material-icons"
                                                    style={{
                                                      marginLeft: "20px",
                                                      marginTop: "20px",
                                                    }}
                                                  >
                                                    thumb_down
                                                  </i>

                                                  <i
                                                    class="material-icons"
                                                    style={{
                                                      marginLeft: "10px",
                                                      marginTop: "20px",
                                                    }}
                                                  >
                                                    thumb_up
                                                  </i>
                                                  <br />
                                                  <form>
                                                    <input
                                                      type="text"
                                                      placeholder="Add a comment"
                                                      name="text"
                                                      style={{ width: "350px" }}
                                                    />
                                                    <button
                                                      style={{
                                                        width: "60px",
                                                        lineHeight: "30px",
                                                        outline: "0",
                                                        borderRadius: "5px",
                                                        color: "white",
                                                        borderColor: "green",
                                                        background: "green",
                                                      }}
                                                    >
                                                      {" "}
                                                      Add
                                                    </button>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ) : null}
                                  </React.Fragment>
                                );
                              })}
                          </React.Fragment>
                        ) : null}
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
          
        </React.Fragment>
      ) : null}
            {Following.data ? (
        <React.Fragment>
          {Following.data.map((test) => {
            return (
              <React.Fragment>
                {test.Following.map((accept) => {
                  return (
                    <React.Fragment>
                      {console.log(accept.accept == 1)}
                      <div>
                        {accept.accept == 1 ? (
                          <React.Fragment>
                            {props.postList.data &&
                              props.postList.data &&
                              props.postList.data.map((posts) => {
                                return (
                                  <React.Fragment>
                                    {accept.request_by ===
                                    posts.Postedby._id  && (props && props.myPosts.data._id !== posts.Postedby._id)  ?  (
                                      <React.Fragment>
                                        {console.log("props.Mypostsprops.Myposts",props.myPosts.data._id)}
                                        {console.log("----------------",props.postList.data.Firstname)}
                                        <div class="col s12 m6">
                                          <div
                                            class="card"
                                            style={{
                                              width: "25%",
                                              margin: "0 auto",
                                              display: "table",
                                            }}
                                          >
                                            <div class="card-content">
                                              <Avtar
                                                src={`http://localhost:3001/public/${posts.Postedby.Photo}`}
                                                size="45"
                                                round={true}
                                                style={{ float: "left" }}
                                              />
                                              <span
                                                class="card-title"
                                                style={{
                                                  fontWeight: "bold",
                                                  marginLeft: "20px",
                                                }}
                                              >
                                                &nbsp;&nbsp;
                                                {posts.Postedby.Username}
                                              </span>
                                              <br />
                                              <h6>{posts.Body}</h6>
                                              <br/>
                                              <img
                                                src={`http://localhost:3001/public/${posts.Photo}`}
                                                alt="mypic"
                                                Width="100%"
                                                height="300px"
                                              />
                                              <div
                                                style={{
                                                  marginLeft: "20px",
                                                  borderTop: "2px gray solid",
                                                }}
                                              >
                                                <div class="card-action">
                                                  <b
                                                    style={{ fontSize: "25px" }}
                                                  >
                                                    0&nbsp;:
                                                  </b>
                                                  <i
                                                    class="material-icons"
                                                    style={{
                                                      marginLeft: "20px",
                                                      marginTop: "20px",
                                                    }}
                                                  >
                                                    thumb_down
                                                  </i>

                                                  <i
                                                    class="material-icons"
                                                    style={{
                                                      marginLeft: "10px",
                                                      marginTop: "20px",
                                                    }}
                                                  >
                                                    thumb_up
                                                  </i>
                                                  <br />
                                                  <form>
                                                    <input
                                                      type="text"
                                                      placeholder="Add a comment"
                                                      name="text"
                                                      style={{ width: "350px" }}
                                                    />
                                                    <button
                                                      style={{
                                                        width: "60px",
                                                        lineHeight: "30px",
                                                        outline: "0",
                                                        borderRadius: "5px",
                                                        color: "white",
                                                        borderColor: "green",
                                                        background: "green",
                                                      }}
                                                    >
                                                      {" "}
                                                      Add
                                                    </button>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </React.Fragment>
                                    ) : null}
                                  </React.Fragment>
                                );
                              })}
                          </React.Fragment>
                        ) : null}
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
          
        </React.Fragment>
      ) : null}
        </React.Fragment>
  )
};

function mapStateToProps(state) {
  return {
    postList: state.PostReducers.postList,
    myPosts: state.PostReducers.myPosts,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    AllPost: () => dispatch(AllPost()),
    Myposts: () => dispatch(Myposts()),
    Postdelete: (postId, history) => dispatch(Postdelete(postId, history)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));

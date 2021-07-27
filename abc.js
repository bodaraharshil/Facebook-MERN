router.post("/followrequest", auth, async (req, res) => {
    try {
      const user = req.user;
      // const userID = req.body.loginID;
      const postUserID = req.body.postuserID;
      const postUser = [];
      console.log(user._id, postUserID);
      if (user._id == postUserID) {
        console.log(user._id, postUserID);
        return res
          .status(208)
          .json({ message: "You are not sending request to you" });
      }
      if (!postUserID) {
        return res.status(204).json({ message: "Please click on follow button" });
      }
      userModel
        .findById(postUserID)
        .then((data) => {
          console.log(data.Followers, user._id);
          data.Followers.find((user) => user.request_by == user._id);
          if (Alreadysendeduser) {
            return res.status(208).json({ message: "You already send request" });
          }
        })
        .catch(() => {
          res.status(400).json({ message: "There first is some error" });
        });
      console.log("::::::::::::::::::", postUser);
      await userModel
        .findById(postUserID)
        .then((data) => {
          // postUser.push(data);
          data.Followers.push({
            request_by: user._id,
            accept: 0,
          });
          data
            .save()
            .then(() => {
              res.status(200).json({ message: "Request send successfully" });
            })
            .catch(() => {
              res.status(400).json({ message: "There is some error" });
            });
        })
        .catch((err) => {
          res.status(400).send({ message: "There is some error" });
        });
    } catch (error) {
      res.status(400).send({ message: "There is some error" });
    }
  });
  
  router.post("/acceptrequest", auth, async (req, res) => {
    try {
      const user = req.user;
      let acceptID = req.body.ID;
      if (!acceptID) {
        return res.status(204).json({ message: "Please Click On accept button" });
      }
      const acceptUser = user.Followers.filter(
        (user) => user.request_by == acceptID
      );
      console.log("..........", acceptID);
      console.log("/././././", acceptUser);
      if (acceptUser.length === 0) {
        return res
          .status(208)
          .json({ message: "Provide user is not sended request to you" });
      }
      let index = user.Followers.findIndex((obj) => obj.request_by == acceptID);
      userModel.findOne({ Username: user.Username }).then((data) => {
        data.Followers.set(index, { request_by: acceptID, accept: 1 });
        data
          .save()
          .then((res) => {
            res.status(200).json({ message: "Your request", data: res });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (error) {
      res.status(400).send({ message: "There is some error" });
    }
  });
  
  router.get("/getrequest", auth, async (req, res) => {
    try {
      const user = req.user;
      await userModel
        .findById(user._id)
        .populate("Followers.request_by")
        .then(async (data) => {
          const UserData = await data.Followers.filter(
            (user) => user.accept === 0
          );
          UserData.map((obj) => {
            return (
              (obj.request_by.lastlogin = ""),
              (obj.request_by.Password = ""),
              (obj.request_by.tokens = [])
            );
          });
          res.status(200).json({ request: UserData });
        })
        .catch((err) => {
          res.status(400).json({ error: "There is some error" });
        });
    } catch (error) {
      res.status(400).send({ message: "There is some error" });
    }
  });

  
  const mongoose = require("mongoose");
const validator = require("validator");
const connection = require("../connection/connection");

const schema = new mongoose.Schema({
  Username: {
    type: String,
    trim: true,
    // unique: true,
  },
  Emailid: {
    type: String,
    trim: true,
    // validate(value) {
    //     if (!validator.isEmail(value)) {
    //         throw new Error()
    //     }
    // }
  },
  Password: {
    type: String,
    trim: true,
  },
  avtar: {
    type: String,
    default: "",
  },
  lastlogin: {
    type: Date,
    default: "",
  },
  Followers: [
    {
      request_by: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      accept: 0,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

const model = mongoose.model("user", schema);

module.exports = model;

// my profile page
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { withRouter, Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { myPostGet } from "../store/actions/mypost";
import { userGet } from "../store/actions/user";
import style from "../styles/myprofile.module.css";
import Notification from "./notification";
import API from "../apiconfi";
import { toast } from "react-toastify";

const Myprofile = (props) => {
  const history = useHistory();
  const [Username, setUsername] = useState();
  const [Emailid, setEmailid] = useState();
  const [Postavail, setPostavail] = useState(false);
  const [updatedAvtar, setupdatedAvtar] = useState("");
  const [totalPost, settotalPost] = useState(0);
  const [Page, setPage] = useState("mypost");
  const [Followers, setFollowers] = useState(0);

  console.log("UserSatte", props);
  const inputEl = useRef(null);

  const triggerInput = () => {
    inputEl.current.click();
  };

  // ***** To get Post *****

  useEffect(() => {
    console.log("Props on Myprofile", props);
    const userData = props.user.userData;
    settotalPost(props.mypost.length);
    setFollowers(userData.Followers.filter((user) => user.accept).length);
    setUsername(userData.Username);
    setEmailid(userData.Emailid);
    setupdatedAvtar(userData.avtar);
  }, [props.user.userData]);

  const setmyPost = () => {
    setPage("mypost");
  };

  const setnotification = () => {
    setPage("notification");
  };

  useEffect(() => {
    axios
      .get(`${API}/mypost`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((data) => {
        setPostavail(true);
        props.myPostGet(data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.warn("You are not loggedin");
      });
    setPostavail(true);
  }, []);

  // ***** Update Data *****
  const UpdateData = () => {
    axios
      .post(
        `${API}/updateuser`,
        {
          Username,
          Emailid,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        toast.success("Update successfully");
        props.userGet(res.data.userData);
        // setUsername(res.userData.Username)
        // setEmailid(res.userData.Emailid)
        console.log("Updates state", res.data.userData.Username);
        history.push("/myprofile");
      })
      .catch((err) => {
        toast.error("There is some error");
      });
  };

  // ***** Update Profile Image *****

  const updateProfile = (e) => {
    const formData = new FormData();
    formData.append("updateAvtar", e.target.files[0]);
    axios
      .post(`${API}/updateavtar`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setupdatedAvtar(res.data.avtar);
        toast.success("Image upload successfully");
      })
      .catch(() => {
        toast.error("There is some error");
      });
  };

  const Mypost = props.mypost;

  return (
    <div>
      <div className={style.hdiv}>
        <div className={style.uDiv}>
          <React.Fragment>
            <div className={style.mainDiv}>
              <div className={style.imageDiv}>
                <img
                  className={style.image}
                  src={`${API}/uploads/profile?Image=${updatedAvtar}`}
                  alt="mypic"
                />
                <input
                  className="custom-file-input image-avatar-input"
                  ref={inputEl}
                  onChange={updateProfile}
                  type="file"
                ></input>
                <img
                  className={style.cameraPic}
                  onClick={triggerInput}
                  src={require("../assets/images/camera@2x.png")}
                  alt=""
                />
                <div className={style.friendDiv}>
                  <div>
                    <h6>Followers</h6>
                    <h6>{Followers}</h6>
                  </div>
                  <div>
                    <h6>Posts</h6>
                    <h6>{totalPost}</h6>
                  </div>
                </div>
              </div>
              <div className={style.contentDiv}>
                <div>
                  <input
                    type="text"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2 "
                  />
                  <input
                    type="email"
                    value={Emailid}
                    onChange={(e) => setEmailid(e.target.value)}
                    className="bg-white rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-base px-4 py-2"
                    style={{ marginTop: "5px" }}
                  />
                  <button
                    onClick={UpdateData}
                    style={{ width: "297px", marginTop: "5px" }}
                    className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Update
                  </button>
                </div>
                <br />
              </div>
            </div>
          </React.Fragment>
        </div>
        <br />
        <br />
        <br />
        <hr color="gray" />
        <div className={style.buttonDiv}>
          <Button
            className={style.button}
            onClick={() => setmyPost()}
            variant="outline-primary"
          >
            My post
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            className={style.button}
            onClick={() => setnotification()}
            variant="outline-success"
          >
            Notification
          </Button>
        </div>
        {Page === "mypost" ? (
          <div className={style.bDiv}>
            {Mypost.map((mypost) => (
              <>
                <img
                  src={`${API}/uploads/post?Post=${mypost.Post}`}
                  alt="mypic"
                  style={{
                    borderRadius: "5%",
                    width: "190px",
                    height: "200px",
                    marginLeft: "18px",
                    boxShadow: "0 1rem 3rem rgba(0, 0, 0, 0.175)",
                  }}
                />
              </>
            ))}
          </div>
        ) : (
          <Notification />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mypost: state.myPostReducer.mypost,
    allPost: state.postReducer.post,
    user: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    myPostGet: (mypost) => dispatch(myPostGet(mypost)),
    userGet: (user) => dispatch(userGet(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Myprofile);

//userprofile component

import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import API from "../apiconfi";
import { toast } from "react-toastify";
import style from "../styles/modelcomponent.module.css";

function Modelcomponent({
  show,
  handleClose,
  clickProfile,
  userPost,
  loginData,
}) {
  console.log("clickProfile", userPost);
  const requestsend = () => {
    axios
      .post(
        `${API}/followrequest`,
        { postuserID: clickProfile._id, loginID: loginData._id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        handleClose();
        if (res.data.message === "Request send successfully") {
          console.log("green");
          return toast.success(res.data.message);
        }
        if (res.data.message === "You are not sending request to you") {
          console.log("sdf");
          return toast.error(res.data.message);
        }
        if (res.data.message === "You already send request") {
          return toast.warn(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("You are not sending to you request");
        handleClose();
      });
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Profile of User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h1>{clickProfile.Username}</h1>
            <h1>{clickProfile.Emailid}</h1>
          </div>
          <div className={style.bDiv}>
            <React.Fragment>
              {userPost.map((mypost) => (
                <>
                  <div
                    class="max-w-sm rounded overflow-hidden shadow-lg"
                    className={style.maindiv}
                  >
                    <img
                      src={`${API}/uploads/post?Post=${mypost.Post}`}
                      alt="mypic"
                      style={{
                        borderRadius: "5%",
                        width: "85px",
                        height: "85px",
                        marginTop: "2px",
                        marginLeft: "18px",
                        boxShadow: "0 1rem 3rem rgba(0, 0, 0, 0.175)",
                      }}
                    />
                    <div class="px-6 py-4">
                      <div class="font-bold  mb-2">{mypost.Title}</div>
                      <p class="text-gray-700 ">{mypost.Body}</p>
                    </div>
                  </div>
                </>
              ))}
            </React.Fragment>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={requestsend}>
            Follow
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modelcomponent;

// notification page

import React, { useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import API from "../apiconfi";
import { Button } from "react-bootstrap";
import { userGet } from "../store/actions/user";
import { toast } from "react-toastify";
import style from "../styles/notification.module.css";
import { useState } from "react";

const Notification = (props) => {
  const [requestUser, setrequestUser] = useState([]);
  // const [allUser, setallUser] = useState([]);
  // const [sameUser, setsameUser] = useState([]);

  useEffect(() => {
    const notacceptuser = props.userData.Followers.filter(
      (request) => request.accept === 0
    );

    axios
      .get(`${API}/getrequest`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        setrequestUser(res.data.request);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const acceptHandle = (id) => {
    console.log(",............", id);
    axios
      .post(
        `${API}/acceptrequest`,
        {
          ID: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((data) => {
        toast.success("Request accepted");
      })
      .catch(() => {
        toast.err("There is some error");
      });
  };
  // const ID = [];
  // const allID = notacceptuser.filter((obj) => ID.push(obj.request_by));
  // console.log("...........", ID);

  // axios.get(`${API}/alluser`, {
  //   headers: {
  //     Authorization: "Bearer " + localStorage.getItem('jwt')
  //   }
  // }).then((res) => {
  //   res.data.userData.map((user) => {
  //     return user._id = '', user.Password = '', user.tokens = [], user.lastlogin = ''
  //   })
  //   setallUser(res.data.userData)
  // }).catch((err) => {
  //   console.log(err)
  // })

  // console.log(
  //   "././././",
  //   allUser.filter((user) => {
  //     return [requestUser.filter((request) => request.request_by === user._id)];
  //   })
  // );

  console.log("All UserRequest", requestUser);
  // console.log("All User", allUser);
  return (
    <>
      <div className={style.mainDiv}>
        {console.log(requestUser)}
        {requestUser.map((user) => (
          <>
            <div className={style.subDiv}>
              <img
                className={style.image}
                src={`${API}/uploads/profile?Image=${user.request_by.avtar}`}
                alt="mypic"
              />
              <div style={{ marginLeft: "10px" }}>
                <h1 className={style.name1}>{user.request_by.Username}</h1>
                <h1>
                  Followers =
                  { 
                    user.request_by.Followers.filter(
                      (users) => users.accept === 1
                    ).length
                  }
                </h1>
              </div>
              {console.log(",,,,,,,,,,,,,", user.request_by)}
              <div className={style.buttonDiv}>
                <Button
                  onClick={() => acceptHandle(user.request_by._id)}
                  className={style.button}
                  variant="outline-success"
                >
                  Accept
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button className={style.button} variant="outline-danger">
                  Reject
                </Button>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    allpost: state.postReducer.post,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userGet: (user) => dispatch(userGet(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
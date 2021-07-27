import React, { useState, useEffect } from "react";
import M from "materialize-css";
import Axios from "axios";
import Avtar from "react-avatar";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Myposts,Mypost,AllPost } from "../store/actions/post";

const Notification = (props) => {
  const [RequestUser, setRequestUser] = useState([]);
  
  useEffect(() => {
    props.Myposts();
    props.Mypost();
    props.AllPost();
    Axios.get(`${process.env.REACT_APP_NODE_API}/getrequest`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        setRequestUser(res.data.request);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const accept = (id) => {
    console.log("ididididididid",id)
    Axios.post(
      `${process.env.REACT_APP_NODE_API}/accept`,
      {
        acceptId: id,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((data) => {
        M.toast({ html: "requested accepted", classes: "green" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {RequestUser.map((user) => {
        return (
          <div class="card " style={{ border: "2px solid gray" }}>
            <div
              style={{
                width: "100%",
                display: "table",
                height: "60px",
                background: "white",
              }}
            >
              <div
                style={{
                  width: "60%",
                  display: "table",
                  background: "white",
                  float: "left",
                  marginTop: "18px",
                }}
              >
                <Avtar
                  src={`http://localhost:3001/public/${user.request_by.Photo}`}
                  size="45"
                  round={true}
                  style={{ float: "left", marginLeft: "20px" }}
                />
                <h6 style={{ marginLeft: "80px" }}>{user.request_by.Email}</h6>
              </div>
              <div
                style={{
                  width: "40%",
                  display: "table",
                  background: "white",
                  float: "left",
                }}
              >
                <a
                  class="waves-effect btn "
                  style={{ background: "#90D98E" }}
                  onClick={() => accept(user.request_by._id)}
                >
                  Accept
                </a>
                <a
                  class="waves-effect btn"
                  style={{ background: "#ff9b9b", margin: "20px" }}
                >
                  Decline
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};
 

function mapStateToProps(state) {
  return {
    postList: state.PostReducers.postList,
    myPosts: state.PostReducers.myPosts,
    mypost:state.PostReducers.myPost
  };
}
function mapDispatchToProps(dispatch) {
  return {
    Myposts: () => dispatch(Myposts()),
    Mypost:() => dispatch(Mypost()),
    AllPost:()=>dispatch(AllPost()),
  };
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Notification)
);

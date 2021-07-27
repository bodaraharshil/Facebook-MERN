import axios from "axios";

export function setLoggedIn() {
  return (dispatch) => {
    dispatch({
      type: "SET_LOGGED_IN",
    });
  };
}

export function AllPost(user, history) {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_NODE_API}/allpost`)
      .then((response) => {
        dispatch({
          type: "USERGET_SUCCESS",
          message: "user get list success",
          data: response.data,
        });
      })
      .catch(function (error) {
        dispatch({
          type: "USERGET_FAILURE",
          message: "Something went wrong",
        });
      });
  };
}

export function AddPost(user, history) {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_NODE_API}/addpost`, user, {
        headers: {
          "content-type": "multipart/form-data",
          authorization: localStorage.getItem("jwt"),
        },
      })
      .then((response) => {
        dispatch({
          type: "USERGET_SUCCESS",
          message: response.data.message,
          status: response.data.status,
        });
        history.push("/");
      })
      .catch(function (error) {
        dispatch({
          type: "USERGET_FAILURE",
          message: "Something went wrong",
        });
      });
  };
}

export function Postdelete(postId, history) {
  return (dispatch) => {
    return axios
      .delete(`${process.env.REACT_APP_NODE_API}/deletepost/${postId}`, {
        headers: { authorization: localStorage.getItem("jwt") },
      })
      .then((response) => {
        dispatch({
          type: "POSTDELETE_SUCCESS",
          message: "user delete success",
        });
      })
      .catch(function (error) {
        dispatch({
          type: "POSTDELETE_FAILURE",
          message: "Something went wrong",
        });
      });
  };
}

export function Mypost() {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_NODE_API}/mypost`, {
        headers: { authorization: localStorage.getItem("jwt") },
      })
      .then((response) => {
        dispatch({
          type: "USERMYPOST_SUCCESS",
          message: "my post list success",
          data: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: "USERMYPOST_FAILURE",
          message: "somthing went wrong",
        });
      });
  };
}

export function Myposts() {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_NODE_API}/profile`, {
        headers: { authorization: localStorage.getItem("jwt") },
      })
      .then((response) => {
        dispatch({
          type: "USERMYPOSTS_SUCCESS",
          message: "my post list success",
          data: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: "USERMYPOSTS_FAILURE",
          message: "somthing went wrong",
        });
      });
  };
}

export function userUpdateprofile(id, data, history) {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_NODE_API}/userupdateprofile`, data, {
        headers: {
          authorization: localStorage.getItem("jwt"),
          "Content-Type": "application/json",
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        dispatch({
          type: "USERUPDATEPROFILE_SUCCESS",
          message: "data updated success..",
        });
        history.push("/Profile");
      })
      .catch(function (error) {
        dispatch({
          type: "USERUPDATEPROFILE_FAILURE",
          message: "Something went wrong",
        });
      });
  };
}

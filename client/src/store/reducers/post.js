const initialState = {
  isInprogress: false,
  isError: false,
  message: "",
  status: null,
  postList: {},
  myPost: {},
  myPosts: {},
};

export default function PostReducers(state = initialState, action) {
  switch (action.type) {
    case "USER_INPROGRESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: "",
      };

    case "USERGET_SUCCESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: action.messsage,
        postList: action.data,
      };

    case "USERGET_FAILURE":
      return {
        ...state,
        isInprogress: false,
        isError: true,
        message: action.messsage,
      };
    case "USERMYPOST_SUCCESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: action.messsage,
        myPost: action.data,
      };

    case "USERMYPOST_FAILURE":
      return {
        ...state,
        isInprogress: false,
        isError: true,
        message: action.messsage,
      };
    case "USERMYPOSTS_SUCCESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: action.messsage,
        myPosts: action.data,
      };

    case "USERMYPOSTS_FAILURE":
      return {
        ...state,
        isInprogress: false,
        isError: true,
        message: action.messsage,
      };
    case "USERUPDATEPROFILE_SUCCESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: action.messsage,
      };
    case "USERUPDATEPROFILE_FAILURE":
      return {
        ...state,
        isInprogress: false,
        isError: true,
        message: action.messsage,
      };
    case "POSTDELETE_SUCCESS":
      return {
        ...state,
        isInprogress: true,
        isError: false,
        message: action.messsage,
      };
    case "POSTDELETE_FAILURE":
      return {
        ...state,
        isInprogress: false,
        isError: true,
        message: action.messsage,
      };

    default:
      return state;
  }
}

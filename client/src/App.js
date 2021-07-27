import React,{useEffect} from 'react';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import './App.css';
import { Provider } from "react-redux";
import store from './store/store';
import Login from "./component/Login";
import Home from "./component/Home";
import Signup from "./component/Signup";
import Profile from './component/Profile';
import Addpost from './component/Addpost';
import Navbar from './component/Navbar';
import Profileupdate from './component/Profileupdate';
import Userprofile from './component/Userprofile';
const Routing=()=>{
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      history.push("/");
    }
    else {
      history.push("/Login");
    }
  }, []);

  return (
    <React.Fragment>
        <Switch>
        <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/Signup">
            <Signup/>
          </Route>
          <Route path="/Profile">
            <Profile/>
          </Route>
          <Route path="/Addpost">
            <Addpost/>
          </Route>
          <Route path="/Profileupdate">
            <Profileupdate/>
          </Route>
          <Route path="/Userprofile">
            <Userprofile/>
          </Route>
        </Switch>
    </React.Fragment>
  )
}

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <BrowserRouter>
        <Navbar/>
          <Routing/>
        </BrowserRouter>
      </Provider>
    </React.Fragment>
  );
}

export default App;

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import AdminDashboard from "./components/admin/AdminDashboard";
import Favourites from "./components/home/Favourites";
import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import MyProfile from "./components/home/MyProfile";
import React from "react";
import Recipe from "./components/home/Recipe";
import Signup from "./components/auth/Signup";
import { useSelector } from "react-redux";

const App = () => {
  const {isloggedin , isAdmin} = useSelector((state) => state.auth);
  return (
    <Router>
      <div className="bg-zinc-100 dark:bg-zinc-900 h-svh w-screen overflow-y-auto">
        <Switch>
          <Route exact path="/">
            {isloggedin ? <Redirect to="/home" /> : <Redirect to="/signup" />}
          </Route>

          {!isloggedin && <>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </>}

          {isloggedin && (
            <>
              {isAdmin && <Route path="/admin" component={AdminDashboard} />}
              <Route path="/home" component={Home} />
              <Route path="/myprofile" component={MyProfile} />
              <Route path="/favourites" component={Favourites} />
              <Route path="/recipe/:recipeId" component={Recipe} />
            </>
          )}
        </Switch>
      </div>
    </Router>
  );
};

export default App;

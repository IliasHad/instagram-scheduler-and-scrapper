import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { IndexPage } from "./views/index";
import { Calendar } from "./views/calendar";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard" exact component={IndexPage} />
        <Route path="/calendar" exact component={Calendar} />
        <Redirect from="/" to="/dashboard" exact />
      </Switch>
    </Router>
  );
}

export default App;

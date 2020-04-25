import React, {useState, useEffect} from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import { IndexPage } from "./pages/index";
import { LoginPage } from "./pages/login";
import Cookies from 'js-cookie';

function App() {
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    if (Cookies.get("isLogged") === "true") {
      setIsLogged(true);
    }
  }, []);
  return (
    <Router>
      <Switch>
      
        
       {!isLogged && <Route path="/login" exact component={LoginPage} />}
        {isLogged && <Route path="/dashboard" exact component={IndexPage} />}
        {!isLogged && <Redirect from="/dashboard" to="/login" exact />}

        {isLogged && <Redirect from="/login" to="/dashboard" exact />}
      
        {isLogged && <Redirect from="/" to="/dashboard" exact />}
        {!isLogged && <Redirect from="/" to="/login" exact />}

      </Switch>
    </Router>
  );
}

export default App;

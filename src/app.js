import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';

import Home from './home/index';
import Login from './login/index';

class App extends React.Component {
  render() {

    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" render={()=>(<Redirect to='/login'/>)} />
            <Route path="/login" component={Login}/>
            <Route path="/home" component={Home}/>
          </Switch>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));

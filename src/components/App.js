import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from '../pages/Login';
import ConfirmTransaction from '../pages/ConfirmTransaction';
import CStageOne from '../pages/corporate/CStageOne';
import CStageTwo from '../pages/corporate/CStageTwo';
import IStageOne from '../pages/individual/IStageOne';

import ThankYou from '../pages/ThankYou';
import Main from '../pages/main/Main';
import ClientType from '../pages/ClientType'
import Upload from '../pages/upload/Upload'


class App extends Component {
  render() {
    return (
     <Router>
      <div>
        <Route exact path="/" component={Login}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/signup" component={ClientType}/>
        <Route path="/corporate" component={CStageOne} />
        <Route path="/corporate_2" component={CStageTwo} />
        <Route path="/individual" component={IStageOne} />
        <Route path="/success" component={ThankYou} />
        {/* <Route path="/app" component={Main} /> */}
        <Route path="/app" render={(props) => (<Main {...props} page='dashboard' /> )}/>
        <Route path="/upload" component={Upload} />
        <Route path="/confirm/:key" component={ConfirmTransaction} />

      </div>
    </Router>
    );
  }
}

export default App;
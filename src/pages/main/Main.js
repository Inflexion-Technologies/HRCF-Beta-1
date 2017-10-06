import React, { Component } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import Overlay from './aux/Overlay';
import Dashboard from '../contents/Dashboard'
import Withdraw from '../contents/Withdraw'
import {Route, Switch, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

import MainStore from '../../stores/MainStore';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            fullScreen : false
        }

        this.hideSideNav = this.hideSideNav.bind(this);
    }

  componentWillMount(){
      this.setState({
          fullScreen : false
      });

      this.user = MainStore.getUser();
      console.log(JSON.stringify(this.user));
  }

  hideSideNav(){
      this.setState({
          fullScreen : true
      })
  }

  render() {
    // if(cookie.load('token') === undefined){
    //     return <Redirect to='/login' />;
    // }else 
    let showOverlay = false;
    if(cookie.load('is_complete') === undefined || cookie.load('is_complete') === 'N'){
        showOverlay = true;
    }
        return (
        <div className="container main">
            <Overlay show={showOverlay} />
            <Header user={this.user.firstname}></Header>
            <div className="row">  
                <div className={this.state.fullScreen ? 'hidden-xs' : 'hidden-xs col-md-2'}>                
                    <SideNav onClose={this.hideSideNav}></SideNav>
                </div>
                <div className={this.state.fullScreen ? "col-xs-12 col-md-12 content" : "col-xs-12 col-md-10 content"}>
                    
                    {/* Content */}
                    <Switch>
                        <Route exact path='/app/dashboard' component={Dashboard}/>
                        <Route exact path='/app/withdraw' component={Withdraw}/>
                    </Switch>
                    
                    
                </div>
            </div>
        </div>
        );
    }

}



export default Main;

import React, { Component } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import CorporateOverlay from './corporate_overlay/CorporateOverlay';
import IndividualOverlay from './individual_overlay/IndividualOverlay';

import Dashboard from '../contents/Dashboard'
import Withdraw from '../contents/Withdraw'
import Upload from '../upload/Upload'
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

  showOverlay(){
    console.log('Type => '+cookie.load('type'));
    console.log('Is Complete => '+cookie.load('is_complete'));

    if((cookie.load('is_complete') === undefined || cookie.load('is_complete') === 'false') && (cookie.load('type') === 'C')){
        console.log('load corporate');
        return <CorporateOverlay show={true}></CorporateOverlay>
    }else if((cookie.load('is_complete') === undefined || cookie.load('is_complete') === 'false') && (cookie.load('type') === 'I')){
        console.log('load individual');
        return <IndividualOverlay show={true}></IndividualOverlay>
    }
  }

  render() {
    // let showOverlay = false;
    
    // if(cookie.load('is_complete') === undefined || cookie.load('is_complete') === 'N'){
    //     showOverlay = true;
    // }
        return (
        <div className="container main">
            {this.showOverlay()}
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
                        <Route exact path='/app/upload' component={Upload}/>
                    </Switch>
                    
                    
                </div>
            </div>
        </div>
        );
    }

}



export default Main;

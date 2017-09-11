import React, { Component } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import Dashboard from '../contents/Dashboard'

import {Route, Switch } from 'react-router-dom';


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
      })
  }

  hideSideNav(){
      this.setState({
          fullScreen : true
      })
  }

  render() {
    return (
       <div className="container main">
           <Header></Header>
           <div className="row">  
               <div className={this.state.fullScreen ? 'hidden-xs' : 'hidden-xs col-md-2'}>                
                 <SideNav onClose={this.hideSideNav}></SideNav>
               </div>
               <div className={this.state.fullScreen ? "col-xs-12 col-md-12 content" : "col-xs-12 col-md-10 content"}>
                   
                   {/* Content */}
                   <Switch>
                    <Route exact path='/app/dashboard' component={Dashboard}/>
                </Switch>
                   
                 
               </div>
           </div>
       </div>
    );
  }
}



export default Main;

import React, { Component } from 'react';
import SideNav from './SideNav';
import Header from './Header';
import CorporateOverlay from './corporate_overlay/CorporateOverlay';
import IndividualOverlay from './individual_overlay/IndividualOverlay';

import Dashboard from '../contents/Dashboard'
import Withdraw from '../contents/Withdraw'
import Upload from '../upload/Upload'
import Fund from '../contents/Fund'

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
            fullScreen : false,
            count : 0
        }
        this.hideSideNav = this.hideSideNav.bind(this);
        this.refresh = this.refresh.bind(this);
    }

  componentWillMount(){
      this.setState({
          fullScreen : false
      });

      this.user = MainStore.getUser();
      console.log(JSON.stringify(this.user));
  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    })
  }

  hideSideNav(){
      this.setState({
          fullScreen : true
      })
  }

  clearDrawer(){
    this.showMobileDrawer = false;
    this.refresh();
  }

  onLogout(){
      this.props.history.push('/login');
      this.clearDrawer();
  }

  onDashboard(){
      this.props.history.push('/app/dashboard');
      this.clearDrawer();      
  }

  onUpload(){
    if(cookie.load('is_admin') === 'Y'){
        this.props.history.push('/app/upload');   
        this.clearDrawer();        
    }
  }

  onWithdrawal(){
      this.props.history.push('/app/withdraw');
      this.clearDrawer();      
  }

  onFundAccount(){
      this.props.history.push('/app/fund');
      this.clearDrawer();      
  }

  getUploadView(){
      if(cookie.load('is_admin') === 'Y'){
          return <div> <div className="menu" onClick={this.onUpload.bind(this)}>Upload</div>
                <div className="clearfix"></div></div>
      }
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

  sideDrawer(){
    return (<div className="side-drawer">
              <div className="s-container">
                  <div className="box">
                      <div className="logout" onClick={this.onLogout.bind(this)}>logout</div>
                      <div className="image-block">
                          <i className="fa fa-user-circle-o header-avatar-icon" aria-hidden="true" style={{fontSize: '3.7em'}}></i>
                      </div>
                      <div className="clearfix"></div>
                      <div className="details">{MainStore.getUserName()}</div>
                      <div className="clearfix"></div>
                      <div className="options">
                          <div className="payment-code">{MainStore.getPaymentCode()}</div>
                          <div className="clearfix"></div>
                          <br/>
                          <div className="available-label">Available Balance</div>
                          <div className="available-value">{MainStore.getAvailableBalance()} GHS</div>
                      </div>
                      <div className="clearfix"></div>
                      <hr style={{marginTop: '4px'}}/>
                      <div></div>
                  </div>
                  <div className="list">
                      <div className="menu" onClick={this.onDashboard.bind(this)}>Dashboard</div>
                      <div className="clearfix"></div>
                      <div className="menu">History</div>
                      <div className="clearfix"></div>
                      {this.getUploadView()}
                      <div className="menu" onClick={this.onWithdrawal.bind(this)}>Withdraw</div>
                      <div className="clearfix"></div>
                      <div className="menu"onClick={this.onFundAccount.bind(this)}>Fund Account</div>
                  </div>

              </div>
          </div>)
  }

  drawerCommand(status){
      this.showMobileDrawer = true;
      this.refresh();
  }

  render() {
   
        return (
        <div>
            {this.showMobileDrawer ? this.sideDrawer() : ''}
            <div className="container main">
                {this.showOverlay()}
                <Header user={this.user.firstname} show={true} showdrawer={this.drawerCommand.bind(this)}></Header>
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
                            <Route exact path='/app/fund' component={Fund}/>
                        </Switch>
                        
                        
                    </div>
                </div>
            </div>

        </div>
        );
    }

}



export default Main;

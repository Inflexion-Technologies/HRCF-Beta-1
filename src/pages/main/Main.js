import React, { Component } from 'react';
import SideNav from './SideNav';
import Header from './Header';

import Dashboard from '../contents/Dashboard'
import Withdraw from '../contents/Withdraw'
import HistoryApp from '../contents/History'
import Upload from '../upload/Upload'
import Fund from '../contents/Fund'
import Profile from '../contents/Profile'

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

  onHistory(){
      this.props.history.push('/app/history');
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

  onCompleteProfile(){
    if(cookie.load('is_complete') === 'false'){        
        this.props.history.push('/app/profile');
        this.clearDrawer();  
    }  
  }

  getUploadView(){
      if(cookie.load('is_admin') === 'Y'){
          return <div> <div className="menu" onClick={this.onUpload.bind(this)}>Upload</div>
                <div className="clearfix"></div></div>
      }
  }

  getCompleteProfileView(){
    if(cookie.load('is_complete') === 'false'){
        return <div> <div className="menu" onClick={this.onCompleteProfile.bind(this)}>Complete Profile</div>
              <div className="clearfix"></div></div>
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
                          <div className="available-label">Balance</div>
                          <div className="available-value">{MainStore.getAvailableBalance()} GHS</div>
                      </div>
                      <div className="clearfix"></div>
                      <hr style={{marginTop: '4px'}}/>
                      <div></div>
                  </div>
                  <div className="list">
                      <div className="menu" onClick={this.onDashboard.bind(this)}>Dashboard</div>
                      <div className="clearfix"></div>
                      <div className="menu" onClick={this.onHistory.bind(this)}>History</div>
                      <div className="clearfix"></div>
                      {this.getUploadView()}
                      <div className="menu" onClick={this.onWithdrawal.bind(this)}>Withdraw</div>
                      <div className="clearfix"></div>
                      <div className="menu"onClick={this.onFundAccount.bind(this)}>Fund Account</div>
                      <div className="clearfix"></div>
                      {this.getCompleteProfileView()}
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
                <Header user={this.user.firstname} show={true} showdrawer={this.drawerCommand.bind(this)}></Header>
                <div className="row">  
                    <div className={this.state.fullScreen ? 'hidden-xs' : 'hidden-xs col-md-2'}>                
                        <SideNav onClose={this.hideSideNav}></SideNav>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 content">
                        
                        {/* Content */}
                        <Switch>
                            <Route exact path='/app/dashboard' component={Dashboard}/>
                            <Route exact path='/app/withdraw' component={Withdraw}/>
                            <Route exact path='/app/upload' component={Upload}/>
                            <Route exact path='/app/history' component={HistoryApp}/>
                            <Route exact path='/app/fund' component={Fund}/>
                            <Route exact path='/app/profile' component={Profile}/>
                        </Switch>
                        
                        
                    </div>
                </div>
            </div>

        </div>
        );
    }

}



export default Main;

import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/custom.css';
import '../../styles/font-awesome/css/font-awesome.css';

//import _ from 'lodash';

class SideNav extends Component {
  constructor(props){
    super(props);

    this.state ={
      open : true
    }

    this.onCloseNav = this.onCloseNav.bind(this);
  }

  componentWillMount(){
    this.payment_number = cookie.load('payment_number');
    
  }

  returnToLogin(){
    this.props.history.push('/login');
  }
  
  onCloseNav(evt){
    this.setState({
      open : false
    })

    this.props.onClose();
  }

  isAdmin(){
    if(cookie.load('is_admin') === 'Y'){
      return true;
    }
    return false;
  }

  isComplete(){
    if(cookie.load('is_complete') === 'true'){
      return true;
    }

    return false;
  }

  render() {
    
        return (
          <div className={this.state.open ? "sidebar": "close"}>
            <div className="clearfix"></div>

            <div className="sidenav">
                <div className="close-div">
                  {/* <i className="fa fa-eye-slash close-icon" onClick={this.onCloseNav} aria-hidden="true"></i> */}
                </div>
                <div className="user-profile">
                    <div className="avatar">
                      <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                      <div className="details">{this.payment_number}</div>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <ul>
                  <li>
                    <Link to="/app/dashboard">
                        <i className="fa fa-tachometer" aria-hidden="true"></i>
                        Dashboard
                    </Link>
                  </li>
                  <li>
                      <Link to="/app/history">
                        <i className="fa fa-history" aria-hidden="true"></i>
                        History
                    </Link>
                  </li>

                  <li className={this.isAdmin() ? '':'hide'}>
                      <Link to="/app/upload">
                        <i className="fa fa-upload" aria-hidden="true"></i>
                        Upload
                      </Link>
                  </li>
                  <li>
                      <Link to="/app/withdraw">
                        <i className="fa fa-money" aria-hidden="true"></i>
                        Withdraw
                      </Link>
                  </li>
                  <li>
                      <Link to="/app/fund">
                        <i className="fa fa-university" aria-hidden="true"></i>
                        Fund Account
                      </Link>
                  </li>
                  <li className={this.isComplete() ? 'hide':''}>
                      <Link to="/app/profile">
                        <i className="fa fa-user" aria-hidden="true"></i>
                        Complete Profile
                      </Link>
                  </li>
                </ul>
            </div>
          </div>
        );
      }
    
}

export default SideNav;
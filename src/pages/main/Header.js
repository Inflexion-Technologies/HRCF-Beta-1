import React, { Component } from 'react';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import {Link} from 'react-router-dom';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Header extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){

  }

  onOpen(evt){
    this.props.show();
  }

  render() {
    return (
      <div className="header">
        <i className={this.props.show ? 'fa fa-bars header-switch-icon show' : 'fa fa-bars header-switch-icon'} aria-hidden="true"></i>
        <Img src={icam_icon} className="header-logo-icon" />
        <div className="hidden-xs header-user">
          {this.props.user}
        </div>
          <i className="hidden-xs fa fa-user-circle-o header-avatar-icon" aria-hidden="true"></i>
          <i className="hidden-lg hidden-md fa fa-user-circle-o header-avatar-icon" style={{color : '#00838f'}} aria-hidden="true"></i>
  
        <div className="clearfix"></div>
        <div className="row">
          <div className="hidden-md hidden-lg col-xs-12 hidden-menu">
            <Link to="/app/dashboard" ><div className="col-xs-3">Home</div></Link>
            <div className="col-xs-3">History</div>
            <Link to="/app/withdraw" ><div className="col-xs-3">Withdraw</div></Link>
            <div className="col-xs-3">Fund Account</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
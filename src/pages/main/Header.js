import React, { Component } from 'react';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';

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
        <div className="header-user">
          {this.props.user}
        </div>
        <i className="fa fa-user-circle-o header-avatar-icon" onClick={this.onOpen} aria-hidden="true"></i>
        
      </div>
    );
  }
}

export default Header;
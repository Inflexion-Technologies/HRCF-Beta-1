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
      open : true,
      is_admin : false
    }

    this.onCloseNav = this.onCloseNav.bind(this);
  }

  componentWillMount(){
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

  render() {
    
        return (
          <div className={this.state.open ? "sidebar": "close"}>
            <div className="clearfix"></div>

            <div className="sidenav">
                <div className="close-div">
                  <i className="fa fa-eye-slash close-icon" onClick={this.onCloseNav} aria-hidden="true"></i>
                </div>
                <div className="user-profile">
                    <div className="avatar">
                      <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                      <div className="details">IC User</div>
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

                  <li className={this.state.is_admin ? '':'hide'}>
                      <Link to="/app/settings">
                        <i className="fa fa-cog" aria-hidden="true"></i>
                        Upload
                      </Link>
                  </li>
                  <li>

                  <Link to="/app/settings">
                    <i className="fa fa-cog" aria-hidden="true"></i>
                    Settings
                  </Link>
                  </li>
                </ul>
            </div>
          </div>
        );
      }
    
}

export default SideNav;
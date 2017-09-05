import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';

class SideBar extends Component {
  render() {
    return (
        <aside id="aside" className="ui-aside">
            <ul className="nav">
                <li className="nav-head">
                    <h5 className="nav-title text-uppercase light-txt">Navigation</h5>
                </li>
                <li className="active">
                    <a><i className="fa fa-home"></i><span>Dashboard</span><i className="fa fa-angle-right pull-right"></i></a>
                    <ul className="nav nav-sub nav-sub--open">
                        <li className="nav-sub-header"><a ><span>Dashboard</span></a></li>
                    </ul>
                </li>

                <li>
                    <a><i className="fa fa-font-awesome"></i><span>Uploads </span> <i className="fa fa-angle-right pull-right"></i></a>
                </li>
            
                <li className="nav-head">
                    <h5 className="nav-title text-uppercase light-txt">Utilities</h5>
                </li>
                <li>
                    <a><i className="fa fa-television"></i><span>Settings</span><i className="fa fa-angle-right pull-right"></i></a>
                    
                </li>
            
            </ul>
        </aside>
    );
  }
}

export default SideBar;

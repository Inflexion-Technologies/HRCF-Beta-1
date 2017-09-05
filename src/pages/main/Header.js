import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';

class Header extends Component {
  render() {
    return (
        <header id="header" className="ui-header">
                <div className="navbar-header">
                    <a href="index.html" className="navbar-brand">
                        <span className="logo"><img src="imgs/logo-dark.png" alt=""/></span>
                        <span className="logo-compact"><img src="imgs/logo-icon-dark.png" alt=""/></span>
                    </a>
                </div>

                <div className="search-dropdown dropdown pull-right visible-xs">
                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-expanded="true"><i className="fa fa-search"></i></button>
                    <div className="dropdown-menu">
                        
                    </div>
                </div>

                <div className="navbar-collapse nav-responsive-disabled">

                    <ul className="nav navbar-nav">
                        <li>
                            <a className="toggle-btn" data-toggle="ui-nav" >
                                <i className="fa fa-bars"></i>
                            </a>
                        </li>
                    </ul>
                    
                    <form className="search-content hidden-xs" >
                        <button type="submit" name="search" className="btn srch-btn">
                            <i className="fa fa-search"></i>
                        </button>
                    </form>
                    
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            
                          
                        </li>

                        <li className="dropdown">
                            
                            
                        </li>

                        <li className="dropdown dropdown-usermenu">
                            <a  className=" dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                                <div className="user-avatar"><img src="imgs/a0.jpg" alt="..." /></div>
                                <span className="hidden-sm hidden-xs">John Doe</span>
                                <span className="caret hidden-sm hidden-xs"></span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-usermenu pull-right">
                                <li><a ><i className="fa fa-life-ring"></i>  Settings</a></li>
                                <li className="divider"></li>
                                <li><a ><i className="fa fa-sign-out"></i> Log Out</a></li>
                            </ul>
                        </li>

                        <li>
                            <a data-toggle="ui-aside-right" ><i className="glyphicon glyphicon-option-vertical"></i></a>
                        </li>
                    </ul>        
                </div>
        </header>
    );
  }
}

export default Header;

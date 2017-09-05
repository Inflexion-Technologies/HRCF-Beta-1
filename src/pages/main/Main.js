import React, { Component } from 'react';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';

import Header from './Header';
import SideBar from './SideBar';

//import MainStore from '../../stores/MainStore';
//import * as MainAction from '../../actions/MainAction';
//import _ from 'lodash';

class Main extends Component {
  render() {
    return (
      <div id="ui" className="ui">
            <Header />
            <SideBar />
         
            <div id="content" className="ui-content ui-content-aside-overlay">
                <div className="ui-content-body">

                    <div className="ui-container">

                        <div className="row">
                            <div className="col-md-8">
                                
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="panel">
                                    <header className="panel-heading panel-border">
                                        Upload History
                                        <span className="tools pull-right">
                                            {/* <a className="refresh-box fa fa-repeat"></a>
                                            <a className="collapse-box fa fa-chevron-down"></a>
                                            <a className="close-box fa fa-times"></a> */}
                                        </span>
                                    </header>
                                    <div className="panel-body">
                                        <div className="row">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div id="footer" className="ui-footer">
                2017 &copy; Powered by Insyt.
            </div>
      </div> 
    );
  }
}

export default Main;

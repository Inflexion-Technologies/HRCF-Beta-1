import React, { Component } from 'react';

import {Link} from 'react-router-dom';
import users_icon from '../../../icons/users.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import ReactSVG from 'react-svg';


class WCompleteProfile extends Component {
  constructor(props){
    super(props);
    this.state = {
      count : 0
    }
  }

  componentWillMount(){
   
  }

  componentWillUnMount(){
    
  }

  render() {
      return (
              <div className="col-md-12 stage">
              <div className="col-md-4 sider hidden-xs">
                  <div className="col-md-12 target logo">
                      <ReactSVG path={users_icon} callback={svg => {}} className="svg"/>
                  </div>
              </div>
              <div className="col-md-8 wcontent" style={{background : '#00695c'}}>
                <div className="col-md-3"></div>
                <div className="col-md-6 wpanel">
                  <div className="content-height">
                    <div className="input-style" style={{fontWeight: '600',fontSize: '14px'}}>Ooops! Profile Not Completed</div>

                    <div className="form-group no-funds-style">
                      
                      <div className="clearfix"></div>
                      <div className="breaker"></div>    
                      <div>Please complete your profile before any further request. </div>
                      <div>Click below to complete the process. Thank you.</div>
                      <div className="clearfix"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>
                    </div>

                    
                 </div>

                  <div className="form-group">
                    <Link to="/app/profile" className="btn btn-md btn-default btn-block action-btn typo-style" style={{marginTop : '30px'}}>Complete Profile</Link>
                  </div>
                </div>
                <div className="col-md-3"></div>

              </div>
                  
                
            </div>
      );
  }
}

export default WCompleteProfile;
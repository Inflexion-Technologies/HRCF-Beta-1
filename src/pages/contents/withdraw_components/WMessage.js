import React, { Component } from 'react';

import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'

import CountDown from '../../CountDownTimer';


import envelop from '../../../icons/close-envelope.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';


import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WMessage extends Component {
  constructor(props){
    super(props);
    this.state = {
      count : 0
    }
    this.type = 'I'
  }

  componentWillMount(){
  
  }

  componentWillUnMount(){
    
  }

  redirectToApp(){
    this.resetWithdrawPage();
    window.location.href = '/app/dashboard'    
  }

  stop(){
    this.redirectToApp();        
  }

  resetWithdrawPage(){
    WithdrawStore.reset();
  }

  onNext(evt){
    WithdrawStore.next();
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
      show = true;
      
      return (
              <div className="col-md-12 stage">
              <div className="col-md-4 sider hidden-xs">
                  <div className="col-md-12 target logo">
                      <ReactSVG path={envelop} callback={svg => {}} className="svg"/>
                  </div>
              </div>
              <div className="col-md-8 wcontent stage3-style">
                <div className="col-md-3"></div>
                <div className="col-md-6 wpanel">
                  <div className="content-height">
                    <div className="form-group message">
                    <span className="message-style">You have successfully completed the withdrawal proccess. You will be automatically logged in 
                        <span><CountDown duration={10} stop={this.stop.bind(this)}/></span>secs. Thank you.
                    </span>
                    <span></span>
                    </div>
                 </div>

                  <div className="form-group">
                    <a className="btn btn-md btn-default btn-block action-btn" onClick={this.onNext.bind(this)}>Back To Dashboard</a>
                  </div>
                </div>
                <div className="col-md-3"></div>

              </div>          
                
            </div>
      );
    }else{
      return null
    }

  }
}

export default WMessage;
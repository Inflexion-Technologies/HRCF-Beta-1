import React, { Component } from 'react';

import OverlayStore from '../../../stores/OverlayStore';
import CountDown from '../../CountDownTimer'
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'
import {Link} from 'react-router-dom';

import envelop from '../../../icons/close-envelope.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';
import { Redirect } from 'react-router';


import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WMessage extends Component {
  constructor(){
    super();
    this.state = {
      count : 0,
      redirect : false
    }
    this.type = 'I';
  }

  componentWillMount(){
  }

  componentWillUnMount(){
    
  }

  autoResetPage(){
    const app = this;

    clearTimeout(this.timer);
    
    this.timer = setTimeout(()=>{
      app.resetWithdrawPage();
    }, 2000);
  }

  stop(){
    this.resetWithdrawPage();
    //this.props.router.push('/app/dashboard');  
    this.setState({
      redirect : true
    })
  }

  resetWithdrawPage(){
    WithdrawStore.reset();
  }

  onNext(evt){
    WithdrawStore.next();
  }

  render() {

    let show = false;
    if(this.state.redirect){
      return (
        <Redirect push to="/app/dashboard"/>        
      );
    }

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
                    <span className="message-style">You have successfully initiated the withdrawal proccess.
                         Please check your mail to complete the approval process.
                         Thank you.
                         
                    </span>
                    <span></span>
                    </div>
                 </div>

                  <div className="form-group">
                    <Link to="/app/dashboard" className="btn btn-md btn-default btn-block action-btn">Back To Dashboard in 
                    <span><CountDown duration={10} stop={this.stop.bind(this)}/></span>secs
                    </Link>
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
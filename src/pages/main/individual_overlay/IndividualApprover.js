import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import * as utils from '../../../utils/utils';


//import _ from 'lodash';

class IndividualApprover extends Component {
  constructor(props){
    super(props);
    this.state = {
      approver : '',
      msisdn : '',
      email : '',
      count : 0
    }

    this.onApproverChanged = this.onApproverChanged.bind(this);

    this.approverNameError = 'Please Specify Approver';
    this.nError = false;

    this.approverMsisdnError = 'Please Enter Correct Number';
    this.mError = false;

    this.approverEmailError = 'Please Enter Correct Email';
    this.eError = false;
  }

  componentWillMount(){

  }

  onApproverChanged(evt){
    this.setState({
      approver : evt.target.value
    })
  }

  onMobileChanged(evt){
    this.setState({
      msisdn : evt.target.value
    })
  }

  onEmailChanged(evt){
    this.setState({
      email : evt.target.value
    })
  }

  onNextClicked(evt){
    if(this.validate()){
      this.refresh();
      OverlayStore.next();
      
    }else{
      this.refresh();
    }
  }

  onSkip(){
    OverlayStore.setSecondaryApprover({});    
    OverlayStore.next();    
  }

  onBackClicked(){
    OverlayStore.back();
  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    });
  }

  validate(){
    let detail = {};

    //Check Approver Name & id
    console.log('Approver '+this.state.approver);
    if(this.state.approver && utils.isAlphabets(this.state.approver) && this.state.approver.trim().length > 0){
      detail.approver = this.state.approver;

      this.nError = false;
    }else{
      this.approverNameError = 'Please Specify Approver';
      this.nError = true;
      return false;
    }

    //Check Branch
    console.log('Mobile '+this.state.msisdn);
    
    if(this.state.msisdn && utils.isMSISDN(this.state.msisdn)){
      detail.approver_msisdn = this.state.msisdn;

      this.mError = false;
    }else{
      this.approverMsisdnError = 'Please Enter Correct Number';
      this.mError = true;
      return false;
    }

    //Check Account Name
    console.log('Email '+this.state.email);
    
    if(this.state.email && utils.isEmail(this.state.email)){
      detail.approver_email = this.state.email;
      this.eError = false;
    }else{
      this.approverEmailError = 'Please Enter Correct Email';
      this.eError = true;
      return false;
    }

    //Push data to store
    if(this.props.validate){
      OverlayStore.setPrimaryApprover(detail);      
    }else{
      OverlayStore.setSecondaryApprover(detail);
    }

    return true;
  }

  getOptions(input, callback) {
    const banks = [];
    callback(null, {options: banks,complete: true});
  }

  onOpen(evt){
    this.props.show();
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;
    }

    return (
        <div className={show ? 'row wizard-style': 'hide'}>
          <div className="col-md-12">
                <div className="dialog-title">{this.props.title}</div>
                {this.props.validate ? <div></div> : <div className="skip-style" onClick={this.onSkip.bind(this)}>skip</div>}
                <div className="clearfix"></div>
                  <div className="overlay-content-style">
                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="Name of Approver" value={this.state.approver} onChange={this.onApproverChanged.bind(this)}/>
                        <span className={this.nError ? 'error' : 'vamus'}>{this.approverNameError}</span>
                    </div>

                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="Mobile" value={this.state.msisdn} onChange={this.onMobileChanged.bind(this)}/>
                        <span className={this.mError ? 'error' : 'vamus'}>{this.approverMsisdnError}</span>
                    </div>

                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.onEmailChanged.bind(this)}/>
                        <span className={this.eError ? 'error' : 'vamus'}>{this.approverEmailError}</span>
                    </div>
                  </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-xs-12">
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onBackClicked.bind(this)}>Back</a>
                    </div>
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onNextClicked.bind(this)}>Next</a>
                    </div>
              </div>
            </div>
        </div>
    );
  }
}

export default IndividualApprover;
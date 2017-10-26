import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import * as utils from '../../../utils/utils';


//import _ from 'lodash';

class CorporateCReg extends Component {
  constructor(props){
    super(props);
    this.state = {
      regNumber : '',
      count : 0
    }

    this.onRegNumberChanged = this.onRegNumberChanged.bind(this);

    this.registrationError = 'Please Specify Correct Reg.';
    this.rError = false;

    this.registrationNameError = 'Please Specify Company.';
    this.cError = false;
  }

  componentWillMount(){

  }

  onRegNumberChanged(e){
    this.setState({
      regNumber : e.target.value
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

   //Check Reg Type
   console.log('Reg # '+this.state.regNumber);
   if(this.state.regNumber && utils.isValidRegNumber(this.state.regNumber)){
     detail.reg_number = this.state.regNumber;

     this.rError = false;
   }else{
     this.registrationError = 'Please Specify Correct Reg.';
     this.rError = true;
     return false;
   }

    //Push data to store
    OverlayStore.setCompanyInfo(detail);

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
                <div className="clearfix"></div>
                  <div className="overlay-content-style">
                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="Name of Company" value={OverlayStore.getCompany()} disabled/>
                        <span className={this.cError ? 'error' : 'vamus'}>{this.registrationNameError}</span>
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-style">
                        <input type="text" className="form-control" placeholder="Company Reg. #" value={this.state.regNumber} onChange={this.onRegNumberChanged.bind(this)}/>
                        <span className={this.rError ? 'error' : 'vamus'}>{this.registrationError}</span>
                    </div>
                  </div>
            </div>
            <div className="clearfix"></div>
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

export default CorporateCReg;
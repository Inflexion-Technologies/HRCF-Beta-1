import React, { Component } from 'react';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class Approver extends Component {
  constructor(props){
    super(props);
    this.state = {
      aError : false,
      mError : false,
      approver : '',
      msisdn : '',
      multi : false,
      value : ''
    }

    this.onApproverChanged = this.onApproverChanged.bind(this);

    this.approverError = 'Please Specify Approver';
    this.msisdnError = 'Invalid Mobile Number';
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

  onEmailChanged(evt){}

  onBankChange(evt){
    this.setState({
      value : evt
    })
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
            <div className="">
                <input type="text" className="form-control" placeholder="Name of Approver" value={this.state.approver} onChange={this.onApproverChanged.bind(this)}/>
                <span className={this.state.aError ? 'error' : 'vamus'}>{this.approverError}</span>
            </div>
            <div className="">
                <input type="text" className="form-control" placeholder="Mobile" value={this.state.msisdn} onChange={this.onMobileChanged.bind(this)}/>
                <span className={this.state.mError ? 'error' : 'vamus'}>{this.msisdnError}</span>
            </div>
            <div className="">
                <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.onEmailChanged.bind(this)}/>
                <span className={this.state.eError ? 'error' : 'vamus'}>{this.emailError}</span>
            </div>
            </div>
        </div>
    );
  }
}

export default Approver;
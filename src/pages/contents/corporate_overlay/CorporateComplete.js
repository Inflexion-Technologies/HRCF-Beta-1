import React, { Component } from 'react';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class CorporateComplete extends Component {
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

  }

  onMobileChanged(evt){

  }

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
    if(this.props.page === 7){
        show = true;
    }

    return (
        <div className={show ? 'row wizard-style': 'hide'}>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>

                <div className="congrats">Terms Of Use</div>
            </div>
        </div>
    );
  }
}

export default CorporateComplete;
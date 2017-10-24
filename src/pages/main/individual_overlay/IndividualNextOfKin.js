import React, { Component } from 'react';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class IndividualNextOfKin extends Component {
  constructor(props){
    super(props);
    this.state = {
      nError : false,
      mError : false,
      kin : '',
      msisdn : '',
      multi : false,
      value : ''
    }

    this.onBankChange = this.onBankChange.bind(this);

    this.nokError = 'Please Specify Next of Kin';
    this.msisdnError = 'Invalid Mobile Number';
  }

  componentWillMount(){

  }

  onKinChanged(evt){
    this.setState({
        kin : evt.target.value
    })
  }

  onMobileChanged(evt){
    this.setState({
        msisdn : evt.target.value
    })
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
    if(this.props.page === -3){
        show = true;
    }

    return (
        <div className={show ? 'row wizard-style' : 'hide'}>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>

            <div className="">
                <input type="text" className="form-control" placeholder="Next of Kin" value={this.state.kin} onChange={this.onKinChanged.bind(this)}/>
                <span className={this.state.nError ? 'error' : 'vamus'}>{this.nokError}</span>
            </div>
            <div className="">
                <input type="text" className="form-control" placeholder="Mobile" value={this.state.msisdn} onChange={this.onMobileChanged.bind(this)}/>
                <span className={this.state.mError ? 'error' : 'vamus'}>{this.msisdnError}</span>
            </div>
            </div>
        </div>
    );
  }
}

export default IndividualNextOfKin;
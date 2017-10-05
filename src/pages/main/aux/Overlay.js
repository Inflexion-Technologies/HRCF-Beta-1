import React, { Component } from 'react';
import Img from 'react-image';
import icam_icon from '../../../icons/icam_logo.png';
// import NextOfKin from './NextOfKin';
import Banks from './Banks';
import Approver from './Approver';
import Review from './Review';
import Complete from './Complete';
import UploadID from './UploadID';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class Overlay extends Component {
  constructor(props){
    super(props);
    this.state = {
      nError : false,
      mError : false,
      kin : '',
      msisdn : '',
      multi : false,
      value : '',
      page : 1,
      count : 0
    }
    this.sn = true;
    this.onBankChange = this.onBankChange.bind(this);
    this.onBackClicked = this.onBackClicked.bind(this);
    this.onNextClicked = this.onNextClicked.bind(this);
    this.showNext = this.showNext.bind(this);

    this.nokError = 'Please Specify Next of Kin';
    this.msisdnError = 'Invalid Mobile Number';
    this.assert = true;
  }

  componentWillMount(){
    
  }

  onKinChanged(evt){
  }

  onMobileChanged(evt){

  }

  onBankChange(evt){
    this.setState({
      value : evt
    })
  }

  onBackClicked(evt){
    console.log('page num[Back] => '+this.state.page);
    
    if(this.state.page > 1 && this.state.page <= 6){
      console.log('Got inn');
      this.setState({
        page : this.state.page - 1
      });
      this.sn = true;
    }

  }

  onNextClicked(evt){
    console.log('page num[Forward] => '+this.state.page);
    if(this.state.page >= 1 && this.state.page <= 5){
      console.log('Got inn');
      this.setState({
        page : this.state.page + 1
      });
    }else{
      if(this.state.page >= 5){

        this.assert = false;
        console.log('Assert is false');
        this.setState({
          count : this.state.count + 1
        })
      }
    }
    
  }

  getOptions(input, callback) {
    const banks = [];
    callback(null, {options: banks,complete: true});
  }

  showNext(show){
    console.log('show next '+show);
    this.sn = show;
  }

  render() {
    let next = 'next';
    if(this.state.page === 6){
      next = 'done';
    }

    return (

      <div className={this.props.show && this.assert ? "show overlay" : "overlay"}>
        <div className="container">
          <div className="row">
            <div className="col-md-offset-3 col-md-6 overlay-container">
              <div className="row dialog-header">
                <div className="title">
                  Complete Your Profile
                </div>
                <div className="paginator">
                  {this.state.page} <small>of</small> 6
                </div>
                <div></div>
              </div>
              <div className="row">
                <div className="col-md-4 illustrate hidden-xs">
                  <Img src={icam_icon} className="icon" />
                </div>
                <div className="col-md-8 input-container">

                    {/* <NextOfKin page={this.state.page} title="Next Of Kin"/> */}
                    <Banks page={this.state.page} title="Bank Profiles #1" pageNumber="1" bankPlaceholder="Select Primary Bank"/>
                    <Banks page={this.state.page} title="Bank Profiles #2 (Optional)" pageNumber="2" bankPlaceholder="Select Secondary Bank"/>

                    <Approver page={this.state.page} title="Approver  #1" pageNumber="3"/>
                    <Approver page={this.state.page} title="Approver  #2" pageNumber="4"/>

                    <UploadID page={this.state.page} showNext={this.showNext} title="Upload National ID"/>
                    <Review page={this.state.page} title="Review"/>
                    <Complete page={this.state.page} />

                    <div className="row">
                      <div className={this.state.page === 1 ? 'hide' : 'col-md-6 col-xs-6'}>
                        <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onBackClicked}>Back</a>
                      </div>
                      <div className={(this.state.page === 1 && this.sn) ? 'col-md-12' : 'col-md-6 col-xs-6'}>
                        <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onNextClicked}>{next}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Overlay;
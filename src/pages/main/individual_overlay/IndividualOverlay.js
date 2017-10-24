import React, { Component } from 'react';
import Img from 'react-image';
import icam_icon from '../../../icons/icam_logo.png';
// import NextOfKin from './NextOfKin';
import Banks from './IndividualBanks';
import Approver from './IndividualApprover';
import Review from './IndividualReview';
import Complete from './IndividualComplete';
import UploadID from './IndividualUploadID';
import OverlayStore from '../../../stores/OverlayStore'

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class IndividualOverlay extends Component {
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
    this.pageChanged = this.pageChanged.bind(this);
    this.doOverlayUpdate = this.doOverlayUpdate.bind(this);

    this.isUncomplete = true;
  }

  componentWillMount(){
    OverlayStore.setOverlayType('I');
    OverlayStore.on('overlay_page_changed', this.pageChanged);
    OverlayStore.on('overlay_update_successful', this.doOverlayUpdate);
  }

  componentWillUnMount(){
    OverlayStore.removeListener('overlay_page_changed', this.pageChanged);
    OverlayStore.removeListener('overlay_update_successful', this.doOverlayUpdate);    
  }

  doOverlayUpdate(){
    this.isUncomplete = false;
    this.pageChanged();
  }

  pageChanged(){
    this.setState({
      count : this.state.count + 1
    })
  }

  componentDidMount(){
    this.bank1Component = this.refs.bank1;
    this.bank2Component = this.refs.bank2;
    this.approver1Component = this.refs.approver1;
    this.approver2Component = this.refs.approver2;
    this.uploadComponent = this.refs.upload;
    this.reviewComponent = this.refs.review;

    //console.log(this.bank1.valid());
  }

  getOptions(input, callback) {
    const banks = [];
    callback(null, {options: banks,complete: true});
  }

  render() {
    const page = OverlayStore.getPage();
    
    return (
      <div className={this.props.show && this.isUncomplete ? "show overlay" : "overlay"}>
        <div className="container">
          <div className="row">
            <div className="col-md-offset-3 col-md-6 overlay-container">
              <div className="row dialog-header">
                <div className="title">
                  Complete Your Profile
                </div>
                <div className="paginator">
                  {page} <small>of</small> 4
                </div>
                <div></div>
              </div>
              <div className="row">
                <div className="col-md-4 illustrate hidden-xs">
                  <Img src={icam_icon} className="icon" />
                </div>
                <div className="col-md-8 input-container">
                    <Banks ref="bank1" page={page} title="Bank Profiles #1" pageNumber={1} bankPlaceholder="Select Primary Bank" validate={true}/>
                    <Banks ref="bank2" page={page} title="Bank Profiles #2 (Optional)" pageNumber={2} bankPlaceholder="Select Secondary Bank" showNext={true} validate={false}/>
                    <UploadID ref="upload" page={page} title="Upload National ID" pageNumber={3} validate={true}/>
                    <Review ref="review" page={page} title="Review" pageNumber={4}/>
                    <Complete page={page} pageNumber={5}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default IndividualOverlay;
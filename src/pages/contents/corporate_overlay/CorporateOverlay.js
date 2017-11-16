import React, { Component } from 'react';
import icam_icon from '../../../icons/icam_logo.png';
// import NextOfKin from './NextOfKin';
import Banks from './CorporateBanks';
import Approver from './CorporateApprover';
import Review from './CorporateReview';
import Complete from './CorporateComplete';
import UploadID from './CorporateUploadID';
import Registration from './CorporateCReg';

import OverlayStore from '../../../stores/OverlayStore'
import * as OverlayAction from '../../../actions/OverlayAction'
import Img from 'react-image';
import form_icon from '../../../icons/forms.svg'


import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class CorporateOverlay extends Component {
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
    OverlayStore.setOverlayType('C'); 
    OverlayAction.getUserCompany();

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
            <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
              <div className="paginator">
                  {page} <small>of</small> 7
              </div>
              <div className="clearfix"></div>
              <div className="hidden-xs hidden-sm col-md-4 col-lg-4 ad">
                <Img src={form_icon} className="icon"/>
              </div>

              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 content-container">
                <div className="dialog-header">
                  
                  <div className="clearfix"></div>
                  <div className="title">
                    Complete Your Profile
                  </div>
                  
                  <div></div>
                </div>
                <div className="col-md-offset-2 col-md-8 col-xs-12 input-container">
                    <Banks ref="bank1" page={page} title="Bank Profiles #1" pageNumber={1} bankPlaceholder="Select Primary Bank" validate={true}/>
                    <Banks ref="bank2" page={page} title="Bank Profiles #2 (Optional)" pageNumber={2} bankPlaceholder="Select Secondary Bank" showNext={true} validate={false}/>

                    <Approver ref="approver1" page={page} title="Approver  #1" pageNumber={3} validate={true}/>
                    <Approver ref="approver2" page={page} title="Approver  #2" pageNumber={4} validate={false}/>
                    <Registration ref="registration" page={page} title="Company Info" pageNumber={5} validate={true} />
                    <UploadID ref="upload" page={page} title="Upload National ID" pageNumber={6} validate={true}/>
                    <Review ref="review" page={page} title="Review" pageNumber={7}/>
                </div>
              </div>
            </div>
    );
  }
}

export default CorporateOverlay;
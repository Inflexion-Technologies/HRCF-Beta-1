import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class CorporateReview extends Component {
  constructor(props){
    super(props);
  }

  componentWillMount(){

  }

  onBackClicked(evt){
    console.log('Back clicked'+OverlayStore.getPage());
    OverlayStore.back();
  }

  onConfirmClicked(evt){
    const details = OverlayStore.getAllInfo();
    OverlayAction.updateDetails(details);
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;
    }

    const primary_bank = OverlayStore.getAllInfo().primary_bank_name;
    const primary_branch = OverlayStore.getAllInfo().primary_branch_name;
    const account_name = OverlayStore.getAllInfo().primary_account_name;
    const account_number = OverlayStore.getAllInfo().primary_account_number;
    const approver_name = OverlayStore.getAllInfo().secondary_approver_first != null ? OverlayStore.getAllInfo().primary_approver_first+' & '+OverlayStore.getAllInfo().secondary_approver_first : OverlayStore.getAllInfo().primary_approver_first;
    const approver_msisdn = OverlayStore.getAllInfo().secondary_approver_msisdn != null ? OverlayStore.getAllInfo().primary_approver_msisdn+' & '+OverlayStore.getAllInfo().secondary_approver_msisdn : OverlayStore.getAllInfo().primary_approver_msisdn;
    const approver_email = OverlayStore.getAllInfo().secondary_approver_email != null ? OverlayStore.getAllInfo().primary_approver_email+' & '+OverlayStore.getAllInfo().secondary_approver_email : OverlayStore.getAllInfo().primary_approver_email;
    const id_type = OverlayStore.getAllInfo().id_type;
    const id_number = OverlayStore.getAllInfo().id_number;

    return (
        <div className={show ? 'row wizard-style': 'hide'}>
            <div className="col-md-12 review">
                <div className="dialog-title">{this.props.title}</div>
                <div className="clearfix"></div>
                <div className="overlay-content-style">

                    <div className="col-md-6 col-xs-12">
                        <div className="col-md-12 review-label">Account Name</div>
                        <div className="col-md-12 review-value">{account_name}</div>

                        <div className="col-md-12 review-label">Account Number</div>
                        <div className="col-md-12 review-value">{account_number}</div>

                        <div className="col-md-12 review-label">Bank</div>
                        <div className="col-md-12 review-value">{primary_bank}, {primary_branch}</div>

                        <div className="col-md-12 review-label">ID Details</div>
                        <div className="col-md-12 review-value">{id_type}, {id_number}</div>
                    </div>

                    <div className="col-md-6 col-xs-12">
                        <div className="col-md-12 review-label">Approver(s)</div>
                        <div className="col-md-12 review-value">{approver_name}</div>

                        <div className="col-md-12 review-label">Approver(s) Mobile</div>
                        <div className="col-md-12 review-value">{approver_msisdn}</div>

                        <div className="col-md-12 review-label">Approver(s) Email</div>
                        <div className="col-md-12 review-value2">{approver_email}</div>
                    </div>

                </div>
            </div>

            <div className="row">
                <div className="col-md-12 col-xs-12">
                    <div className='col-md-6 col-xs-6'>
                        <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onBackClicked}>Back</a>
                    </div>
                    <div className='col-md-6 col-xs-6'>
                        <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onConfirmClicked}>Confirm</a>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default CorporateReview;
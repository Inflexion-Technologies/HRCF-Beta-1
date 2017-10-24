import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';

import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import * as utils from '../../../utils/utils';


//import _ from 'lodash';

class IndividualBanks extends Component {
  constructor(props){
    super(props);
    this.state = {
      nError : false,
      aError : false,
      account : '',
      value : 'Select A Bank',
      bvalue : 'Select Branch',
      count : 0
    }

    this.onBankChange = this.onBankChange.bind(this);
    this.onBranchChange = this.onBranchChange.bind(this);
    this.refresh = this.refresh.bind(this);

    this.bankNameError = 'Please Select a Bank';
    this.bnkError = false;

    this.bankBranchError = 'Please Select a Branch';
    this.brError = false;

    this.accountNameError = 'Please Specify Account Name';
    this.acError = false;

    this.accountNumberError = 'Please Specify Account Number';
    this.anError = false;

    this.loadBanks = this.loadBanks.bind(this);
    this.loadBranches = this.loadBranches.bind(this);
    this.isAllValid = true;

    this.bank_id = 0;
    this.bank_name = '';

    this.branch_name = '';
    this.branch_id = 0;
  }

  componentWillMount(){
    OverlayAction.loadOverlayBanks();
    OverlayStore.on('overlay_banks_loaded', this.loadBanks)
    OverlayStore.on('overlay_branches_loaded', this.loadBranches)
  }

  componentWillUnMount(){
    OverlayStore.removeListener('overlay_banks_loaded', this.loadBanks)
    OverlayStore.removeListener('overlay_branches_loaded', this.loadBranches)
  }

  loadBanks(){
    this.setState({
        count : this.state.count + 1
    })
  }

  valid(){
    return this.isAllValid;
  }

  loadBranches(){
    this.setState({
        count : this.state.count + 1
    })
  }

  onAccountChanged(evt){
    this.setState({
        account : evt.target.value
    })

  }

  onAccountNameChanged(evt){
    this.setState({
        account_name : evt.target.value
    })

  }

  onBankChange(e){
    this.setState({
      value : e.target.value
    })

    OverlayAction.loadOverlayBranches(e.target.value);

    const bank = OverlayStore.getBanks().find((bank)=>{
      return parseInt(e.target.value) === parseInt(bank.value);
    })
    
    this.bank_id = e.target.value;
    this.bank_name = bank.label;
  }


  onBranchChange(e){
    this.setState({
      bvalue : e.target.value
    })

    const branch = OverlayStore.getBranches().find((branch)=>{
      return parseInt(e.target.value) === parseInt(branch.value);
    })

    this.branch_name = branch.label;
    this.branch_id = e.target.value;
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
    OverlayStore.setSecondaryBank({});    
    OverlayStore.next();    
  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    });
  }

  validate(){
    let detail = {};

    //Check Bank Name & id
    console.log('Bank '+this.bank_name);
    if(this.bank_name && this.bank_name.length > 0){
      detail.bank_name = this.bank_name;
      detail.bank_id = this.bank_id;

      this.bnkError = false;
    }else{
      this.bankNameError = 'Please Choose A Bank';
      this.bnkError = true;
      return false;
    }

    //Check Branch
    console.log('Branch '+this.branch_name);
    
    if(this.branch_name && this.branch_name.length > 0){
      detail.branch_name = this.branch_name;
      detail.branch_id = this.branch_id;

      this.brError = false;
    }else{
      this.bankBranchError = 'Please Choose A Branch';
      this.brError = true;
      return false;
    }

    //Check Account Name
    console.log('Acc. Name '+this.state.account_name);
    
    if(this.state.account_name && utils.isAlphabets(this.state.account_name) && this.state.account_name.trim().length > 0){
      detail.account_name = this.state.account_name;
      this.acError = false;
    }else{
      this.accountNameError = 'Please Specify Account Name';
      this.acError = true;
      return false;
    }

    //Check Account Number
    console.log('Acc. # '+this.state.account);
    
    if(this.state.account && utils.isAccountNumber(this.state.account)){
      detail.account_number = this.state.account;
      this.anError = false;
    }else{
      this.accountNumberError = 'Please Specify Account Number';
      this.anError = true;
      return false;
    }

    //Push data to store
    if(this.props.validate){
      OverlayStore.setPrimaryBank(detail);      
    }else{
      OverlayStore.setSecondaryBank(detail);
    }
    return true;
  }

  onBackClicked(evt){
    console.log('Back clicked'+OverlayStore.getPage());
    OverlayStore.back();
  }

  onOpen(evt){
    this.props.show();
  }

  getSelectOptions(data){
    if(data){
      return data.map((d)=>{
        return <option value={d.value}>{d.label}</option>
      })
    }else{
      return <option value="0">Loading ...</option>
    }
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;
    }

    return (
        <div className={show ?'row wizard-style':'hide'}>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>
            {this.props.validate ? <div></div> : <div className="skip-style" onClick={this.onSkip.bind(this)}>skip</div>}
            <div className="clearfix"></div>
              <div className="overlay-content-style">

                  <div className="form-style">
                      <select className="form-control" defaultValue={this.state.value} onChange={this.onBankChange}>
                        {this.getSelectOptions(OverlayStore.getBanks())}
                      </select>
                      <span className={this.bnkError ? 'error' : 'vamus'}>{this.bankNameError}</span>
                  </div>

                  <div className="form-style">
                      <select className="form-control" defaultValue={this.state.bvalue} onChange={this.onBranchChange}>
                        {this.getSelectOptions(OverlayStore.getBranches())}
                      </select>
                      <span className={this.brError ? 'error' : 'vamus'}>{this.bankBranchError}</span>
                  </div>

                  <div className="form-style">
                      <input type="text" className="form-control" placeholder="Account Name" value={this.state.account_name} onChange={this.onAccountNameChanged.bind(this)}/>
                      <span className={this.acError ? 'error' : 'vamus'}>{this.accountNameError}</span>
                  </div>
                  <div className="form-style">
                      <input type="text" className="form-control" placeholder="Account Number" value={this.state.account} onChange={this.onAccountChanged.bind(this)}/>
                      <span className={this.anError ? 'error' : 'vamus'}>{this.accountNumberError}</span>
                  </div>
              </div>
            </div>

            <div className="row">
                {this.props.showNext ? <div className="col-md-12 col-xs-12">
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onBackClicked.bind(this)}>Back</a>
                    </div>
                    <div className='col-md-6 col-xs-6'>
                      <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onNextClicked.bind(this)}>Next</a>
                    </div>
              </div> : <div className='col-md-12 col-xs-12'>
                <div className='col-md-12 col-xs-12'>
                  <a className="btn btn-md btn-default btn-block update-btn" onClick={this.onNextClicked.bind(this)}>Next</a>
                </div>
              </div>}
              
          </div>
        </div>
    );
  }
}

export default IndividualBanks;
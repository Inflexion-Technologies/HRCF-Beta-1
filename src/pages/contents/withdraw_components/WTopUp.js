import React, { Component } from 'react';
import Select from 'react-select';
import DayPickerInput from "react-day-picker/DayPickerInput";
import DayPicker from "react-day-picker";

import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'
import NumberFormat from 'react-number-format'
import {Link} from 'react-router-dom';

import 'react-select/dist/react-select.css';
import coin_icon from '../../../icons/icon.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';


import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WTopUp extends Component {
  constructor(props){
    super(props);
    this.state = {
      nError : false,
      aError : false,
      account : '',
      value : '',
      amount : 0,      
      bvalue : '',
      remarks : '',
      count : 0
    }

    this.onBankChange = this.onBankChange.bind(this);
    this.accountError = 'Invalid Account Number';
    this.loadBanks = this.loadBanks.bind(this);
    this.loadBranches = this.loadBranches.bind(this);
    this.isAllValid = true;
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

  onBankChange(evt){
    this.setState({
      value : evt
    })

    OverlayAction.loadOverlayBranches(evt.value);
  }

  onBranchChange(evt){
    this.setState({
      bvalue : evt
    })
  }

  onAmountChanged(evt){
    console.log('Evt : '+evt.target.value);
    
    this.setState({
        amount : evt.target.value
    })

    if(evt.target.value.includes(',')){
      WithdrawStore.setAmount(this.getConvertedToValue(evt.target.value));      
    }else{
      WithdrawStore.setAmount(evt.target.value);            
    }

  }

  onRemarksChanged(evt){
    this.setState({
      remarks : evt.target.value
    })
  
  }

  getOptions(input, callback) {
    const banks = OverlayStore.getBanks();
    callback(null, {options: banks, complete: true});
  }

  getBOptions(input, callback) {
    const branches = OverlayStore.getBranches();
    callback(null, {options: branches,complete: true});
  }

  onOpen(evt){
    this.props.show();
  }

  onNext(evt){
    WithdrawStore.next();
  }

  getConvertedToValue(val){
    if(val.includes(',')){
      let arr = val.split(',');
      let tmpVal = '';
      arr.map((v)=>{
        tmpVal += v;
      })      

      return parseInt(tmpVal);
    }

  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
      show = true;

      return (
              <div className="col-md-12 stage">
              <div className="col-md-4 sider hidden-xs">
                  <div className="col-md-12 target logo">
                      <ReactSVG path={coin_icon} callback={svg => {}} className="svg"/>
                  </div>
              </div>
              <div className="col-md-8 wcontent stage4-style">
                <div className="col-md-3"></div>
                <div className="col-md-6 wpanel">
                  <div className="content-height">
                    <div className="input-style" style={{fontWeight: '600',fontSize: '14px'}}>Sorry, No Funds Available</div>

                    <div className="form-group no-funds-style">
                      <div>Dear {OverlayStore.getFirstName()}, </div>
                      <div className="clearfix"></div>
                      <div className="breaker"></div>                      <div>please fund your account with any of these </div>
                      <div>Banks below with your personal account number <span>{OverlayStore.getPaymentNumber()}</span></div>
                      <div className="clearfix"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>
                      <div className="breaker"></div>


                      <div className="banks">Ecobank</div>
                      <div className="banks">Guaranty Trust Bank (GTB)</div>
                      <div className="banks">Stanbic Bank</div>
                      <div className="banks">Cal Bank</div>
                      <div className="banks">Standard Chartered Bank</div>
                      <div className="banks">Barlays Bank</div>
                      <div className="banks">HFC Bank</div>
                    </div>

                    
                 </div>

                  <div className="form-group">
                    <Link to="/app/dashboard" className="btn btn-md btn-default btn-block action-btn typo-style" style={{marginTop : '30px'}}>Back to Dashboard</Link>
                  </div>
                </div>
                <div className="col-md-3"></div>

              </div>
                  
                
            </div>
      );


    }else{
      return null
    }

  }
}

export default WTopUp;
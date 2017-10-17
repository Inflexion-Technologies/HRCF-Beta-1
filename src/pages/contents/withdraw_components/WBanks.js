import React, { Component } from 'react';
import Select from 'react-select';
import DayPickerInput from "react-day-picker/DayPickerInput";
import DayPicker from "react-day-picker";

import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'
import NumberFormat from 'react-number-format'

import 'react-select/dist/react-select.css';
import bank_icon from '../../../icons/bank-building-b.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';


import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WBanks extends Component {
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
                      <ReactSVG path={bank_icon} callback={svg => {}} className="svg"/>
                  </div>
              </div>
              <div className="col-md-8 wcontent stage1-style">
                <div className="col-md-3"></div>
                <div className="col-md-6 wpanel">
                  <div className="content-height">
                    <div className="input-style">Select A Bank</div>
                    <div className="form-group">
                      <Select.Async multi={false} placeholder={this.props.bankPlaceholder} value={this.state.value} onChange={this.onBankChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getOptions} />
                    </div>

                    <div className="input-style">Enter An Amount </div>
                    <div className="form-group">
                          {/* <input type="text" className="form-control" placeholder="0.00" value={this.state.amount} onChange={this.onAmountChanged.bind(this)} /> */}
                          <NumberFormat thousandSeparator={true} value={this.state.amount} className="form-control amount-style" onChange={this.onAmountChanged.bind(this)} />
                    </div>

                    <div className="input-style">Remarks </div>
                    <div className="form-group">
                          <input type="text" className="form-control" placeholder="Remarks" value={this.state.remarks} onChange={this.onRemarksChanged.bind(this)} />
                    </div>
                 </div>

                  <div className="form-group">
                    <a className="btn btn-md btn-default btn-block action-btn" onClick={this.onNext.bind(this)}>next</a>
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

export default WBanks;
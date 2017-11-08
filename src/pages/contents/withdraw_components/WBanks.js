import React, { Component } from 'react';
import Select from 'react-select';
import DayPickerInput from "react-day-picker/DayPickerInput";
import DayPicker from "react-day-picker";

import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'
import TransactionStore from '../../../stores/TransactionStore'
import * as TransactionAction from '../../../actions/TransactionAction'


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
      acctError : false,
      aError : false,
      account : 0,
      value : '',
      amount : 0,      
      remarks : '',
      count : 0
    }

    this.accountError = 'Please Select Account';
    this.acctError = false;

    this.amountMsgError = 'You have insufficient balance';
    this.amtError = false;

    this.onAccountChanged = this.onAccountChanged.bind(this);
    this.refresh = this.refresh.bind(this);
    this.isAllValid = true;
  }

  componentWillMount(){
    TransactionAction.getAccount();
    TransactionStore.on('transaction_user_accounts', this.refresh);    
  }

  componentWillUnMount(){
    TransactionStore.removeListener('transaction_user_accounts', this.refresh);
  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    })
  }

  validate(){    
    //Check Account
    console.log('Account ID => '+this.state.account);
    if(parseInt(this.state.account) > 0){
      TransactionStore.setAccount(this.state.account);      
      this.acctError = false;
    }else{
      this.accountError = 'Please Select Account';
      this.acctError = true;
      return false;
    }

    if(this.state.amount.includes(',')){
      const amount = this.getConvertedToValue(this.state.amount);
      TransactionStore.setAmount(amount);
      this.amtError = false;
    }else if(parseInt(this.state.amount) > 0){
      TransactionStore.setAmount(this.state.amount);
      this.amtError = false;
    }else{
      this.amtError = true;
      return false;
    }

    if(parseInt(this.state.amount) > TransactionStore.getAvailableBalance()){
      this.amtError = true;
      this.amountMsgError = 'You have insufficient balance';
      return false;
    }else{
      this.amtError = false;
    }
    
    TransactionStore.setRemarks(this.state.remarks);
    return true;
  }

  onAccountChanged(e){
    this.setState({
        account : e.target.value
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

  onOpen(evt){
    this.props.show();
  }

  onNext(evt){
    if(this.validate()){
      this.refresh();
      WithdrawStore.next();      
    }else{
      this.refresh();
    }
  }

  getSelectOptions(data){
    if(data){
      return data.map((d)=>{
        return <option value={d.value}>{d.label}</option>
      })
    }
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
                    <div className="input-style">Select Account</div>
                    <div className="form-group">
                      <select className="form-control" value={this.state.account} onChange={this.onAccountChanged}>
                      {this.getSelectOptions(TransactionStore.getSelectData())}
                      </select>
                      <span className={this.acctError ? 'error' : 'vamus'}>{this.accountError}</span>
                    </div>

                    <div className="input-style">Enter An Amount </div>
                    <div className="form-group">
                          {/* <input type="text" className="form-control" placeholder="0.00" value={this.state.amount} onChange={this.onAmountChanged.bind(this)} /> */}
                          <NumberFormat thousandSeparator={true} value={this.state.amount} className="form-control amount-style" onChange={this.onAmountChanged.bind(this)} />
                          <span className={this.amtError ? 'error' : 'vamus'}>{this.amountMsgError}</span>
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
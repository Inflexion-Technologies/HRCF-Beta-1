import React, { Component } from 'react';
import WithdrawStore from '../../../stores/WithdrawStore'
import TransactionStore from '../../../stores/TransactionStore'
import * as TransactionAction from '../../../actions/TransactionAction'


import 'react-select/dist/react-select.css';
import check_icon from '../../../icons/check-square.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WConfirm extends Component {
  constructor(props){
    super(props);
    this.state = {
      pError : false,
      password : '',
      count : 0
    }
    this.requestNotSent = true;

    // this.userConfirmed = this.userConfirmed.bind(this);
    this.proceed = this.proceed.bind(this);
    this.notEnoughFunds = this.notEnoughFunds.bind(this);
    this.rejectTransaction = this.rejectTransaction.bind(this);

    this.isAllValid = true;
    this.pswdCorrect = false;
    this.isFundsBalanced = true;
  }

  componentWillMount(){
    this.pswdCorrect = false;
    this.isFundsBalanced = true;

    WithdrawStore.setAmount('0.00');
    
    // TransactionStore.on('transaction_user_confirm_valid', this.userConfirmed);
    TransactionStore.on('transaction_user_confirm_invalid', this.rejectTransaction);
    TransactionStore.on('transaction_user_confirm_request', this.proceed);    
    TransactionStore.on('transaction_user_failed_request', this.rejectTransaction);    
    TransactionStore.on('transaction_user_not_enough_funds', this.notEnoughFunds);
    
}

  componentWillUnMount(){
    // TransactionStore.removeListener('transaction_user_confirm_valid', this.userConfirmed);
    TransactionStore.removeListener('transaction_user_confirm_invalid', this.rejectTransaction);
    TransactionStore.removeListener('transaction_user_confirm_request', this.proceed);        
    TransactionStore.removeListener('transaction_user_failed_request', this.rejectTransaction);   
    TransactionStore.on('transaction_user_not_enough_funds', this.notEnoughFunds);    
}

  onPasswordChanged(e){
      this.setState({
          password : e.target.value
      })
  }

  proceed(){
    WithdrawStore.next();   
    console.log('Should move !'); 
  }

  rejectTransaction(){
      this.pError = true;
      this.passwordError = 'Wrong Password';
      this.isFundsBalanced = true;

      this.refresh();
  }

  notEnoughFunds(){
    this.isFundsBalanced = false;
    this.pError = false;

    this.refresh();
  }

  validate(){
    //Validate password
    console.log('Password => '+this.state.password);
    if(this.state.password.length >= 6){
      this.pError = false;
    }else{
      this.passwordError = 'Check password length';
      this.pError = true;
      return false;
    }

    return true;
  }

  onBack(evt){
      WithdrawStore.back();
  }

  onConfirm(evt){
      if(this.validate()){
        let detail = {};

        detail.account_id = TransactionStore.getAccount();
        detail.amount = TransactionStore.getAmount();
        detail.password = this.state.password;

        console.log('W I T H D R A W => '+detail.amount);


        TransactionAction.placeRequest(detail);
      }else{
        this.refresh();
      }
  }

  refresh(){
      this.setState({
          count : this.state.count + 1
      })
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;

        return (
                <div className="col-md-12 stage">
                <div className="col-md-4 sider hidden-xs">
                <div className="col-md-12 target logo">
                    <ReactSVG path={check_icon} callback={svg => {}} className="svg"/>
                </div>
                </div>
                <div className="col-md-8 wcontent stage2-style">
                <div className="col-md-3"></div>

                <div className="col-md-6 wpanel">
                    <div className="content-height">

                        <div className={this.isFundsBalanced ? 'hide' : 'form-group'}>
                            <div className="confirm-label" style={{fontSize: '15px', padding: '5px', letterSpacing: '2px', background: '#000000', textAlign: 'center'}}>Insufficient Funds</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Account Name</div>
                            <div className="confirm-label">{TransactionStore.getAccountName()}</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Account No.</div>
                            <div className="confirm-label">{TransactionStore.getAccountNumber()}</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Bank</div>
                            <div className="confirm-label">{TransactionStore.getBank()}, {TransactionStore.getBranch()}</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Amount</div>
                            <div className="confirm-label">{TransactionStore.getAmount()}</div>
                        </div>

                        <div className="form-group">
                            <div className="confirm-label petit-margin"> </div>
                            <input type="password" className="form-control password-style" placeholder="Enter Password To Confirm" value={this.state.password} onChange={this.onPasswordChanged.bind(this)} />
                            <span className={this.pError ? 'error' : 'vamus'} style={{color:'#555555'}}>{this.passwordError}</span>
                        </div>
                    </div>
                   
                    <div className="form-group">
                        <a className="col-md-6 btn btn-md btn-default btn-block action-btn" onClick={this.onBack.bind(this)}>back</a>
                        <a className="col-md-6 btn btn-md btn-default btn-block action-btn" onClick={this.onConfirm.bind(this)}>confirm</a>
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

export default WConfirm;
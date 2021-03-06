import React, { Component } from 'react';

import WBanks from './withdraw_components/WBanks'
import WConfirm from './withdraw_components/WConfirm'
import WMessage from './withdraw_components/WMessage'
import WTopUp from './withdraw_components/WTopUp'
import WCompleteProfile from './withdraw_components/WCompleteProfile'

import * as TransactionAction from '../../actions/TransactionAction'

import WithdrawStore from '../../stores/WithdrawStore'
import TransactionStore from '../../stores/TransactionStore'

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Withdraw extends Component {

    constructor(props){
        super(props);
        this.state = {
            count : 0
        }
       
        this.updateView = this.updateView.bind(this);
        this.updatePageFlow = this.updatePageFlow.bind(this);
        this.updateBalance = this.updateBalance.bind(this);
    }

  componentWillMount(){
    TransactionAction.getBalance();    
    this.pageNumber = WithdrawStore.getPageNumber();
    this.withdrawAmount = WithdrawStore.getAmount();
    this.newBalance = WithdrawStore.getNewBalance();

    TransactionStore.on('transaction_user_balance', this.updateBalance);
    WithdrawStore.on('withdraw_amount_to_deduct', this.updateView);
    WithdrawStore.on('withdraw_next', this.updatePageFlow);
    WithdrawStore.on('withdraw_back', this.updatePageFlow);
  }

  componentWillUnMount(){
    TransactionStore.removeListener('transaction_user_balance', this.updateBalance);    
    WithdrawStore.removeListener('withdraw_amount_to_deduct', this.updateView)
    WithdrawStore.removeListener('withdraw_next', this.updatePageFlow);
    WithdrawStore.removeListener('withdraw_back', this.updatePageFlow);
  }

  updateBalance(){
      this.balance = TransactionStore.getAvailableBalance();
      console.log('Balance From Store => '+TransactionStore.getAvailableBalance());

      WithdrawStore.setBalance(TransactionStore.getAvailableBalance());

      this.setState({
          count : this.state.count + 1
      })
  }

  updatePageFlow(){
      this.pageNumber = WithdrawStore.getPageNumber();
      
      this.setState({
        count : this.state.count+1
      })
  }

  updateView(){
      this.withdrawAmount = WithdrawStore.getAmount();
      this.balance = WithdrawStore.getBalance();
      this.newBalance = WithdrawStore.getNewBalance();
      this.setState({
          count : this.state.count+1
      })
  }

  render() {
    let calculator_color_style = 'calculator-4';
    
    if(this.balance === '0'){
        return (
            <div>
            <div className={"row withdraw "+calculator_color_style}>

                <div className="hidden-xs hidden-sm col-md-4 col-lg-4 kill-padding-except-left">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.balance} 
                        </div>
                        <div className={"label "+calculator_color_style}>Available Balance</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                    <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '34px'}}>-</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.withdrawAmount}
                        </div>
                        <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                    <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '34px'}}>=</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.newBalance}
                        </div>
                        <div className={"label "+calculator_color_style}>New Available Balance</div>
                    </div>
                </div>




                <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-left">
                    <div className="withdraw-widget">
                        <div className="amount">
                            {this.balance}
                            <div className="small"></div>
                        </div>
                        <div className={"label "+calculator_color_style}>Available Balance</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding">
                    <div className="withdraw-widget"  style={{paddingTop : '25px'}} >
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '25px'}} >-</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                            {this.withdrawAmount}
                            <div className="small"></div>
                        </div>
                        <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding-except-left">
                    <div className="withdraw-widget"  style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style}  style={{fontSize : '25px'}} >=</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-3 col-xs-10 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.newBalance}
                        </div>
                        <div className={"label "+calculator_color_style}>New Available Balance</div>
                    </div>
                </div>

            </div>
            {/* Content */}
                <div className="row withdraw-wizard">
                    <WTopUp page={1} pageNumber={this.pageNumber}/>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                
            </div>
    </div>
        )

    }else{

    //Tell to Complete Profile
    if(!WithdrawStore.isProfileComplete()){
        return (
            <div>
            <div className={"row withdraw "+calculator_color_style}>

                <div className="hidden-xs hidden-sm col-md-4 col-lg-4 kill-padding-except-left">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.balance}
                        </div>
                        <div className={"label "+calculator_color_style}>Available Balance</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                    <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '34px'}}>-</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.withdrawAmount}
                        </div>
                        <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                    <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '34px'}}>=</div>
                    </div>
                </div>

                <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.newBalance}
                        </div>
                        <div className={"label "+calculator_color_style}>New Available Balance</div>
                    </div>
                </div>



                <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-left">
                    <div className="withdraw-widget">
                        <div className="amount">
                        
                            {this.balance}
                             <div className="small"></div>
                        </div>
                        <div className={"label "+calculator_color_style}>Available Balance</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding">
                    <div className="withdraw-widget"  style={{paddingTop : '25px'}} >
                        <div className={"label operator "+calculator_color_style} style={{fontSize : '25px'}} >-</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                        
                            {this.withdrawAmount}
                            <div className="small"></div>
                        </div>
                        <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding-except-left">
                    <div className="withdraw-widget"  style={{paddingTop : '25px'}}>
                        <div className={"label operator "+calculator_color_style}  style={{fontSize : '25px'}} >=</div>
                    </div>
                </div>

                <div className="hidden-md hidden-lg col-sm-3 col-xs-10 kill-padding-except-right">
                    <div className="withdraw-widget">
                        <div className="amount">
                            <div className="small">GHS</div>
                            {this.newBalance}
                        </div>
                        <div className={"label "+calculator_color_style}>New Available Balance</div>
                    </div>
                </div>

            </div>
            {/* Content */}
                <div className="row withdraw-wizard">
                    <WCompleteProfile />
                </div>
                <div className="row breaker"></div>
                <div className="row">
                
            </div>
    </div>
        );
    }






    let calculator_color_style = '';
    switch(parseInt(this.pageNumber)){
        case 1 : {
            calculator_color_style = 'calculator-1';
            break;
        }
        case 2 : {
            calculator_color_style = 'calculator-2';
            break;
        }
        case 3 :{
            calculator_color_style = 'calculator-3';
            break;
        }
    }

    return (
            <div>
                <div className={"row withdraw "+calculator_color_style}>

                        <div className="hidden-xs hidden-sm col-md-4 col-lg-4 kill-padding-except-left">
                            <div className="withdraw-widget">
                                <div className="amount">
                                    <div className="small">GHS</div>
                                    {this.balance}
                                </div>
                                <div className={"label "+calculator_color_style}>Available Balance</div>
                            </div>
                        </div>

                        <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                            <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                                <div className={"label operator "+calculator_color_style}  style={{fontSize : '34px'}}>-</div>
                            </div>
                        </div>

                        <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding">
                            <div className="withdraw-widget">
                                <div className="amount">
                                    <div className="small">GHS</div>
                                    {this.withdrawAmount}
                                </div>
                                <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                            </div>
                        </div>

                        <div className="hidden-xs hidden-sm col-md-1 col-lg-1 kill-padding">
                            <div className="withdraw-widget" style={{paddingTop : '25px'}}>
                                <div className={"label operator "+calculator_color_style}  style={{fontSize : '34px'}}>=</div>
                            </div>
                        </div>

                        <div className="hidden-xs hidden-sm col-md-3 col-lg-3 kill-padding-except-right">
                                <div className="withdraw-widget">
                                    <div className="amount">
                                        <div className="small">GHS</div>
                                        {this.newBalance}
                                    </div>
                                    <div className={"label "+calculator_color_style}>New Available Balance</div>
                                </div>
                        </div>


                        <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-left">
                            <div className="withdraw-widget">
                                <div className="amount">
                                    {this.balance}
                                    <div className="small"></div>
                                </div>
                                <div className={"label "+calculator_color_style}>Available Balance</div>
                            </div>
                        </div>

                        <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding">
                            <div className="withdraw-widget"  style={{paddingTop : '25px'}} >
                                <div className={"label operator "+calculator_color_style}  style={{fontSize : '25px'}} >-</div>
                            </div>
                        </div>

                        <div className="hidden-md hidden-lg col-sm-5 col-xs-5 kill-padding-except-right">
                            <div className="withdraw-widget">
                                <div className="amount">
                                    {this.withdrawAmount}
                                    <div className="small"></div>
                                </div>
                                <div className={"label "+calculator_color_style}>Withdraw Amount</div>
                            </div>
                        </div>

                        <div className="hidden-md hidden-lg col-sm-2 col-xs-2 kill-padding-except-left">
                            <div className="withdraw-widget"  style={{paddingTop : '25px'}}>
                                <div className={"label operator "+calculator_color_style}  style={{fontSize : '25px'}} >=</div>
                            </div>
                        </div>

                        <div className="hidden-md hidden-lg col-sm-3 col-xs-10 kill-padding-except-right">
                            <div className="withdraw-widget">
                                <div className="amount">
                                    {this.newBalance}
                                    <div className="small">GHS</div>
                                </div>
                                <div className={"label "+calculator_color_style}>New Available Balance</div>
                            </div>
                        </div>

                </div>
                {/* Content */}
                <div className="row withdraw-wizard">
                    <WBanks page={1} pageNumber={this.pageNumber}/>
                    <WConfirm page={2} pageNumber={this.pageNumber}/>
                    <WMessage page={3} pageNumber={this.pageNumber}/>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                    
                </div>
        </div>
    );
    }
  }
}

export default Withdraw;
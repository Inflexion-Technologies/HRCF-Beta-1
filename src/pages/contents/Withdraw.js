import React, { Component } from 'react';

import WBanks from './withdraw_components/WBanks'
import WConfirm from './withdraw_components/WConfirm'
import WMessage from './withdraw_components/WMessage'

import WithdrawStore from '../../stores/WithdrawStore'


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
    }

  componentWillMount(){
    this.pageNumber = WithdrawStore.getPageNumber();
    this.withdrawAmount = WithdrawStore.getAmount();
    this.balance = WithdrawStore.getBalance();
    this.newBalance = WithdrawStore.getNewBalance();

    WithdrawStore.on('withdraw_amount_to_deduct', this.updateView)
    WithdrawStore.on('withdraw_next', this.updatePageFlow);
    WithdrawStore.on('withdraw_back', this.updatePageFlow);
  }

  componentWillUnMount(){
    WithdrawStore.removeListener('withdraw_amount_to_deduct', this.updateView)
    WithdrawStore.removeListener('withdraw_next', this.updatePageFlow);
    WithdrawStore.removeListener('withdraw_back', this.updatePageFlow);
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
                    <div className="col-md-4 col-xs-5 kill-padding-except-left">
                        <div className="withdraw-widget">
                            <div className="amount">{this.balance}
                                 <div className="small">GHS</div>
                            </div>
                            <div className="label">Current Balance</div>
                        </div>
                    </div>

                    <div className="col-md-1 col-xs-2 kill-padding">
                        <div className="withdraw-widget">
                            <div className="label operator">-</div>
                        </div>
                    </div>

                    <div className="col-md-3 col-xs-5 kill-padding">
                        <div className="withdraw-widget">
                            <div className="amount">{this.withdrawAmount}
                                <div className="small">GHS</div>
                            </div>
                            <div className="label">Withdraw Amount</div>
                        </div>
                    </div>

                    <div className="col-md-1 col-xs-2 kill-padding">
                        <div className="withdraw-widget">
                            <div className="label operator">=</div>
                        </div>
                    </div>

                    <div className="col-md-3 col-xs-10 kill-padding-except-right">
                        <div className="withdraw-widget">
                            <div className="amount">{this.newBalance}
                                <div className="small">GHS</div>
                            </div>
                            <div className="label">New Balance</div>
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

export default Withdraw;

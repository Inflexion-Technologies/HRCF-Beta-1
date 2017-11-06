import React, { Component } from 'react';

import Options from './fund_components/Options'

import * as TransactionAction from '../../actions/TransactionAction'

import WithdrawStore from '../../stores/WithdrawStore'
import TransactionStore from '../../stores/TransactionStore'

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Fund extends Component {

    constructor(props){
        super(props);
        this.state = {
            count : 0
        }
        this.pageNumber = 1;
    }

  componentWillMount(){
   
  }

  componentWillUnMount(){
   
  }

  updateBalance(){
      this.balance = TransactionStore.getBalance();
      console.log('Balance From Store => '+TransactionStore.getBalance());

      WithdrawStore.setBalance(TransactionStore.getBalance());
      WithdrawStore.setBalance(TransactionStore.getBalance());

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
      this.setState({
          count : this.state.count+1
      })
  }

  render() {
    let calculator_color_style = 'calculator-4';
    
   

    return (
            <div>
                <div className="row withdraw-wizard">
                    <Options page={1} pageNumber={this.pageNumber}/>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                    
                </div>
            </div>
    );
}
 
}

export default Fund;

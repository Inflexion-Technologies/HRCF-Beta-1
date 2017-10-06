import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'

import 'react-select/dist/react-select.css';
import coins_icon from '../../../icons/coins.svg';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import ReactSVG from 'react-svg';


//import _ from 'lodash';

class WAmount extends Component {
  constructor(props){
    super(props);
    this.state = {
      nError : false,
      aError : false,
      amount : '',
      count : 0
    }

    this.onAmountChanged = this.onAmountChanged.bind(this);
    this.accountError = 'Invalid Account Number';
    this.isAllValid = true;
  }

  componentWillMount(){
    WithdrawStore.setAmount('0.00');
  }

  componentWillUnMount(){
    
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

  onAmountChanged(evt){
    this.setState({
        amount : evt.target.value
    })

    WithdrawStore.setAmount(evt.target.value);
  }

  onBack(evt){
      WithdrawStore.back();
  }

  onNext(evt){
      //WithdrawStore.next();
  }

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;

        return (
                <div className="col-md-12 stage">
                <div className="col-md-4 sider hidden-xs"></div>
                <div className="col-md-8 wcontent stage2-style">
                <div className="col-md-3"></div>

                <div className="col-md-6 wpanel">
                    <div className="col-md-12 target">
                        <ReactSVG path={coins_icon} callback={svg => {}} className="svg"/>
                    </div>

                    <div className="dialog-title">{this.props.title}</div>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="0.00" value={this.state.amount} onChange={this.onAmountChanged.bind(this)} />
                    </div>
                    <div className="form-group">
                    <a className="col-md-6 btn btn-md btn-default btn-block action-btn" onClick={this.onBack.bind(this)}>back</a>
                    <a className="col-md-6 btn btn-md btn-default btn-block action-btn" onClick={this.onNext.bind(this)}>next</a>
                    </div>
                </div>

                </div>
                    
                
            </div>
        );
    }else{
        return null
    }

  }
}

export default WAmount;
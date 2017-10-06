import React, { Component } from 'react';
import Select from 'react-select';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'

import 'react-select/dist/react-select.css';
import bank_icon from '../../../icons/bank-building.svg';
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
      bvalue : '',
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

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
      show = true;

      return (
              <div className="col-md-12 stage">
              <div className="col-md-4 sider hidden-xs"></div>
              <div className="col-md-8 wcontent stage1-style">
                <div className="col-md-3"></div>

                <div className="col-md-6 wpanel">
                  <div className="col-md-12 target">
                      <ReactSVG path={bank_icon} callback={svg => {}} className="svg"/>
                  </div>

                  <div className="dialog-title">{this.props.title}</div>
                  <div className="form-group">
                    <Select.Async multi={false} placeholder={this.props.bankPlaceholder} value={this.state.value} onChange={this.onBankChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getOptions} />
                  </div>
                  <div className="form-group">
                    <a className="btn btn-md btn-default btn-block action-btn" onClick={this.onNext.bind(this)}>next</a>
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

export default WBanks;
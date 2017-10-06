import React, { Component } from 'react';
import Select from 'react-select';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';

import 'react-select/dist/react-select.css';
import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

//import _ from 'lodash';

class Banks extends Component {
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

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
        show = true;
    }

    return (
        <div className={show ?'row wizard-style':'hide'}>
            <div className="col-md-12">
            <div className="dialog-title">{this.props.title}</div>
                <div className="form-group">
                    <Select.Async multi={false} placeholder={this.props.bankPlaceholder} value={this.state.value} onChange={this.onBankChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getOptions} />
                </div>
                <div className="form-group">
                    <Select.Async placeholder="Select A Branch" value={this.state.bvalue} onChange={this.onBranchChange.bind(this)} valueKey="value" labelKey="label" loadOptions={this.getBOptions} />
                </div>
                <div className="">
                    <input type="text" className="form-control" placeholder="Account Name" value={this.state.account_name} onChange={this.onAccountNameChanged.bind(this)}/>
                    <span className={this.state.aError ? 'error' : 'vamus'}>{this.accountError}</span>
                </div>
                <div className="">
                    <input type="text" className="form-control" placeholder="Account Number" value={this.state.account} onChange={this.onAccountChanged.bind(this)}/>
                    <span className={this.state.aError ? 'error' : 'vamus'}>{this.accountError}</span>
                </div>
            </div>
        </div>
    );
  }
}

export default Banks;
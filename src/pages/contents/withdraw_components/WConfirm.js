import React, { Component } from 'react';
import OverlayStore from '../../../stores/OverlayStore';
import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'

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
      nError : false,
      aError : false,
      password : '',
      count : 0
    }

    this.accountError = 'Invalid Account Number';
    this.isAllValid = true;
    this.pswdCorrect = false;
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

  onPasswordChanged(evt){
    if(evt.target.value === 'password'){
        this.pswdCorrect = true;
    }else{
        this.pswdCorrect = false;
    }

      this.setState({
          password : evt.target.value
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

  onBack(evt){
      WithdrawStore.back();
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
                <div className="col-md-4 sider hidden-xs">
                <div className="col-md-12 target logo">
                    <ReactSVG path={check_icon} callback={svg => {}} className="svg"/>
                </div>
                </div>
                <div className="col-md-8 wcontent stage2-style">
                <div className="col-md-3"></div>

                <div className="col-md-6 wpanel">
                    <div className="content-height">
                        <div className="form-group">
                            <div className="input-style">Bank</div>
                            <div className="confirm-label">Barclays Bank</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Branch</div>
                            <div className="confirm-label">Airport</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Account No.</div>
                            <div className="confirm-label">00102300234532</div>
                        </div>

                        <div className="form-group">
                            <div className="input-style">Amount</div>
                            <div className="confirm-label">120,000.00</div>
                        </div>

                        <div className="form-group">
                            <div className="confirm-label petit-margin"> </div>
                            <input type="password" className="form-control password-style" placeholder="Enter Password To Confirm" value={this.state.password} onChange={this.onPasswordChanged.bind(this)} />
                        </div>
                    </div>
                   
                    <div className="form-group">
                        <a className="col-md-6 btn btn-md btn-default btn-block action-btn" onClick={this.onBack.bind(this)}>back</a>
                        <a className={this.pswdCorrect ? "col-md-6 btn btn-md btn-default btn-block action-btn" : "col-md-6 btn btn-md btn-default btn-block action-btn vamus"} onClick={this.onNext.bind(this)}>confirm</a>
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
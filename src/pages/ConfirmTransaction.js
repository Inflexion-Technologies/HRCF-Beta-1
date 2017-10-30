import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';
import check_tick from '../icons/tick-box-with-a-check-mark.svg';
import {Link} from 'react-router-dom';

import ConfirmStore from '../stores/ConfirmStore';
import * as ConfirmAction from '../actions/ConfirmAction'

import * as utils from '../utils/utils';
import cookie from 'react-cookies';

import ReactSVG from 'react-svg';


class ConfirmTransaction extends Component {
    constructor(props){
        super(props);
        this.state={
            count : 0,
            code : ''
        }

        this.cError = false;
        this.codeErrorMessage = 'code do not match'

        this.isButtonDisabled = false;
        this.confirmButtonText = 'Confirm';
        this.loadData = this.loadData.bind(this);
        this.loadError = this.loadError.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentWillMount(){
       console.log('Key => '+this.props.match.params.key);

        ConfirmAction.confirmTransactionDetails(this.props.match.params.key);

       ConfirmStore.on('confirm_transaction_details_success', this.loadData);
       ConfirmStore.on('confirm_transaction_details_failed', this.loadError);
    }

    componentWillUnMount(){
       
    }

    loadData(){
        this.showDetais = true;
        this.setState({
            count : this.state.count + 1
        })
    }

    loadError(){
        this.showDetais = false;
    }

    refresh(){
        this.setState({
            count : this.state.count + 1
        })
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.onConfirmClicked();
        }
    }

    redirect(link){
        this.props.history.push(link);
    }

    onConfirmClicked(evt){
        if(this.validate()){
            this.refresh();
        }else{
            this.refresh();
        }
    }

    validate(){
        if(this.state.code !== ConfirmStore.getCode()){
            this.cError = true;
            this.codeErrorMessage = 'code do not match';
            return false;
        }

        this.cError = false;

        return true;
    }

    onCodeChange(evt){
      this.setState({
          code : evt.target.value
      })
    } 

    render() {
        return (
            <div className="login confirm">
                <div className="ad col-md-6 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12 target">
                        <ReactSVG path={check_tick} callback={svg => {}} className="svg"/>
                    </div>
                </div>

                <div className="control col-md-6 col-sm-12 col-xs-12">
                    <div className="sign-in-wrapper">
                        <div className="confirm-container" >
                            <div className="text-center">
                                <h2 className="logo">
                                    <Img src={icam_icon2} className="login-icon" />
                                </h2>
                                <br/>
                                <h4 className="title-typo-style">Confirm Transaction</h4>
                            </div>

                            <div className="sign-in-form">

                                <div className="form-group sentence">

                                    Dear {ConfirmStore.getApprover()},

                                    <br/>
 
                                    A cash withdrawal has been initiated on your investment account held with us with the details below:
                                    <br/>
                                    <div className="breaker"></div>

                                    Initiator: <span className="values">{ConfirmStore.getRequester()}</span>
                                    <br/>
                                    <div className="breaker"></div>

                                    Account to Credit: <span className="values">{ConfirmStore.getBank()}, {ConfirmStore.getBranch()}</span>
                                    <br/>
                                    <div className="breaker"></div>

                                    Beneficiary Name: <span className="values">{ConfirmStore.getAccountName()}</span>
                                    <br/>
                                    <div className="breaker"></div>


                                    Amount: <span className="values">GHS {ConfirmStore.getAmount()}</span>
                                    <br/>
                                    <div className="breaker"></div>



                                    Your Approval Code is: <span className="code">{ConfirmStore.getCode()}</span> 
                                    <br/>
                                    <div className="breaker"></div>
                                     
                                    Click below to authorize the transaction by entering your approval code , or reject transaction.


                                    This code is required to complete the transaction.

                                </div>
                                
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="CODE" value={this.state.code} onChange={this.onCodeChange.bind(this)} onKeyPress={this.handleKeyPress}/>
                                    <span className={this.cError ? 'error' : 'vamus'}>{this.codeErrorMessage}</span>
                                </div>

                                <div className="breaker"></div>
                                <div className="breaker"></div>
                            
                                <button className="btn btn-block approve-btn" onClick={this.onConfirmClicked.bind(this)} disabled={this.isButtonDisabled}>{this.confirmButtonText}</button>
                                
                                <Link to="/login" className="btn btn-md btn-default btn-block reject-btn">reject</Link>
                            </div>
                            <div className="text-center copyright-txt">
                                <small className="typo-style">IC Asset Managers  - Copyright © 2017</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmTransaction;
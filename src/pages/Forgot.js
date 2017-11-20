import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/font-awesome/css/font-awesome.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';

import key_icon from '../icons/key.svg';
import {Link} from 'react-router-dom';

import SignupStore from '../stores/SignupStore';
import MainStore from '../stores/MainStore';
import * as SignupAction from '../actions/SignupAction';
import * as MainAction from '../actions/MainAction';

import _ from 'lodash';

import * as utils from '../utils/utils';
import cookie from 'react-cookies';
import ReactSVG from 'react-svg';

class Forgot extends Component {

    constructor(){
        super();
        this.redirect = this.redirect.bind(this);
        this.emailExists = this.emailExists.bind(this);
        this.emailNotExists = this.emailNotExists.bind(this);
        this.emailErrorText = 'Please Enter Email'; 
        this.requestComplete = this.requestComplete.bind(this);    
        this.resetSuccess = false;
        this.resetFailed = false;   

        this.state = {    
            email : '',
            signupButtonText : 'Submit',
            count : 0
        }

        this.refresh = this.refresh.bind(this);
    }

    componentWillMount(){
        SignupStore.on('signup_email_error', this.emailError);
        SignupStore.on('signup_email_exists', this.emailExists);
        SignupStore.on('signup_email_not_exists', this.emailNotExists);

        MainStore.on('forgot_request_success', this.requestComplete);
    }

    componentWillUnMount(){
        SignupStore.removeListener('signup_email_error', this.emailError);
        SignupStore.removeListeneron('signup_email_exists', this.emailExists);
        SignupStore.removeListener('signup_email_not_exists', this.emailNotExists);
        MainStore.on('forgot_request_success', this.requestComplete);        
    }

    requestComplete(){
        this.resetSuccess = true;
        this.disableButton(false, 'Submit');
        
        this.refresh();
    }

    requestFailed(){
        this.resetFailed = true;
        this.refresh();
    }

    redirect(){
        this.props.history.push('/login');
    }

    refresh(){
        this.setState({
            count : this.state.count + 1
        })
    }

    emailError(){
        this.emailErrorText = 'Email Error';
        
        this.setState({
            eError : true
        })

        this.disableButton(false, 'Submit');
    }

    emailExists(){
        this.emailErrorText = '';
        
        this.setState({
            eError : false
        })

        this.disableButton(true, 'Sending ...');
        MainAction.requestReset(this.state.email);
    }

    emailNotExists(){
        this.emailErrorText = 'Email Does Not  Exist';
        this.setState({
            eError : true
        })
        this.disableButton(false, 'Submit');        
    }

    onEmailChanged(evt){
        this.setState({
            email : evt.target.value
        })
    }

    onResetClicked(){
        if(this.doValidate()){
            //Set up user
            this.disableButton(true, 'Please Wait ...');
            this.user = {};
            this.user.email = this.state.email;
            SignupAction.validateEmail(this.user);
        }
    }

    disableButton(isDisable, label){
        this.setState({
            signupButtonText : label,
            isButtonDisabled : isDisable
        });
    }

    doValidate(){
        
        if(this.state.email && utils.isEmail(this.state.email)){
            this.emailErrorText = "";
            this.setState({
                eError : false
            })
            
            return true;
        }else{
            this.emailErrorText = "Please Enter Correct Email";
            
            this.setState({
                eError : true
            })

            return false;
        }
    }

    render() {
        if(this.resetSuccess){
            return (
                    <div className="signup">
                        <div className="ad col-md-8 hidden-sm hidden-xs">
                            <div>
                                <Img src={icam_icon} className="icon" />
                            </div>
                            <div className="col-md-12" style={{padding:'0 100px 100px 200px'}}>
                                <ReactSVG path={key_icon} callback={svg => {}} className="thumb"/>
                            </div>
                        </div>

                        <div className="control col-md-4 col-sm-12 col-xs-12 m-style">
                            <div className="sign-in-wrapper">
                                <div className="sign-container">
                                    <div className="text-center">
                                        <h2 className="logo">
                                            <Img src={icam_icon2} className="login-icon" />
                                        </h2>
                                        <br/>
                                        <h4 className="title-typo-style">Reset Password</h4>
                                    </div>

                                    <div className="sign-in-form">
                                    
                                        <div className="form-group">
                                            <div style={{color: '#fefefe', fontSize: '14px', letterSpacing: '1px', wordSpacing: '2px'}}>An email has been sent to you. Please follow the link to reset your password. Thank You.</div>
                                        </div>
                                    
                                        <br/>
                                    
                                        <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
                                    </div>
                                    <div className="text-center copyright-txt">
                                        <small className="typo-style">IC Asset Managers - Copyright © 2017</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            );
        }


        if(this.resetFailed){
            return (
                    <div className="signup">
                        <div className="ad col-md-8 hidden-sm hidden-xs">
                            <div>
                                <Img src={icam_icon} className="icon" />
                            </div>
                            <div className="col-md-12" style={{padding:'0 100px 100px 200px'}}>
                                <ReactSVG path={key_icon} callback={svg => {}} className="thumb"/>
                            </div>
                        </div>

                        <div className="control col-md-4 col-sm-12 col-xs-12 m-style">
                            <div className="sign-in-wrapper">
                                <div className="sign-container">
                                    <div className="text-center">
                                        <h2 className="logo">
                                            <Img src={icam_icon2} className="login-icon" />
                                        </h2>
                                        <br/>
                                        <h4 className="title-typo-style">Reset Password</h4>
                                    </div>

                                    <div className="sign-in-form">
                                    
                                        <div className="form-group">
                                            <h3>An email has been sent to you. Please follow the link to reset your password. Thank You.</h3>
                                        </div>
                                    
                                        <br/>
                                    
                                        <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
                                    </div>
                                    <div className="text-center copyright-txt">
                                        <small className="typo-style">IC Asset Managers - Copyright © 2017</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            );
        }


        return (
            <div className="signup">
                <div className="ad col-md-8 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12" style={{padding:'0 100px 100px 200px'}}>
                        <ReactSVG path={key_icon} callback={svg => {}} className="thumb"/>
                    </div>
                </div>

                <div className="control col-md-4 col-sm-12 col-xs-12 m-style">
                    <div className="sign-in-wrapper">
                        <div className="sign-container">
                            <div className="text-center">
                                <h2 className="logo">
                                    <Img src={icam_icon2} className="login-icon" />
                                </h2>
                                <br/>
                                <h4 className="title-typo-style">Reset Password</h4>
                            </div>

                            <div className="sign-in-form">
                               
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.onEmailChanged.bind(this)}/>
                                    <span className={this.state.eError ? 'error' : 'vamus'}>{this.emailErrorText}</span>
                                </div>
                            
                                <button className="btn btn-info btn-block" onClick={this.onResetClicked.bind(this)} disabled={this.state.isButtonDisabled}>{this.state.signupButtonText}</button>
                                <br/>
                            
                                <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
                            </div>
                            <div className="text-center copyright-txt">
                                <small className="typo-style">IC Asset Managers - Copyright © 2017</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Forgot;

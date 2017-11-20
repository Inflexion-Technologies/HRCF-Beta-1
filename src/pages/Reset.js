import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/font-awesome/css/font-awesome.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';

import MainStore from '../stores/MainStore';
import * as MainAction from '../actions/MainAction';

import thumb_icon from '../icons/thumb.svg';
import {Link} from 'react-router-dom';

import _ from 'lodash';

import * as utils from '../utils/utils';
import ReactSVG from 'react-svg';

class Reset extends Component {

    constructor(){
        super();
        this.passwordErrorText = 'Please Enter Password';
        this.uuid = '';

        this.state = {    
            password : '',
            pError : false,
            signupButtonText : 'Reset',
            isButtonDisabled : false,
            showPassword : false,
            count : 0        
        }

        this.successfulReset = false;
        this.failedReset = false;

        this.doSuccessfulScreen = this.doSuccessfulScreen.bind(this);
        this.doFailedScreen = this.doFailedScreen.bind(this);
    }

    componentWillMount(){
        this.uuid = this.props.match.params.key;

        MainStore.on('reset_success', this.doSuccessfulScreen);
        MainStore.on('reset_failed', this.doFailedScreen);
        //this.clearCookies();
    }

    componentWillUnMount(){
       MainStore.removeListener('reset_success', this.doSuccessfulScreen);
       MainStore.removeListener('reset_failed', this.doFailedScreen);
    }

    doSuccessfulScreen(){
        this.successfulReset = true;
        this.disableButton(true, 'Reset');        
        this.refresh();
    }

    doFailedScreen(){
        this.failedReset = true;
        this.disableButton(true, 'Reset');                
        this.refresh();
    }

    refresh(){
        this.setState({
            count : this.state.count + 1
        })
    }

    redirect(){
        this.props.history.push('/login');
    }

    handleBrowserConfig(){
        
    }

    onPasswordChanged(evt){
        this.setState({
            password : evt.target.value
        })
    }

    onResetClicked(){
        if(this.doValidate()){
            //Initiate password reset
            this.disableButton(true, 'Please Wait ...');
            this.handleBrowserConfig();

            MainAction.resetPassword(this.uuid, this.state.password);
        }
    }

    onEyeClicked(evt){
        this.setState({
            showPassword : !this.state.showPassword
        })
    }

    disableButton(isDisable, label){
        this.setState({
            signupButtonText : label,
            isButtonDisabled : isDisable
        });
    }

    doValidate(){
        
        if(this.state.password.length > 5){
            this.setState({
                password : this.state.password, 
                pError : false
            })

        }else{
            this.passwordErrorText = 'Password Length MUST be six(6) or more';
            
            this.setState({
                 pError : true
            })


            return false;
        }

        this.refresh();
        return true;
    }

    render() {

        if(this.successfulReset){
            return (
                <div className="signup">
                <div className="ad col-md-8 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="thumb"/>
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
                                <h4 className="title-typo-style">Successful Reset</h4>
                            </div>

                            <div className="sign-in-form">
                               
                                <div className="form-group">
                                    <h3></h3>
                                    <div style={{color: '#fefefe', fontSize: '14px', letterSpacing: '1px', wordSpacing: '2px'}}>You have successfully reset your password. Thank you!.</div>
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

        if(this.failedReset){
            return (
                <div className="signup">
                <div className="ad col-md-8 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="thumb"/>
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
                                <h4 className="title-typo-style">Failed Password Reset</h4>
                            </div>

                            <div className="sign-in-form">
                               
                                <div className="form-group">
                                    <div style={{color: '#fefefe', fontSize: '14px', letterSpacing: '1px', wordSpacing: '2px'}}>Ooops! You were unable to reset your password, please contact support or try again later. Thank you for your patience.</div>
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
                    <div className="col-md-12">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="thumb"/>
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
                                    <div className="col-md-10 col-lg-10 col-xs-10 col-sm-10 kill-padding">
                                        <input type={this.state.showPassword ? 'text': 'password'} className="form-control" style={{borderRadius : '4px 0px 0px 4px', borderRight : '0'}} placeholder="Password" value={this.state.password} onChange={this.onPasswordChanged.bind(this)}/>
                                    </div>
                                    <div className="col-md-2 col-lg-2 col-xs-2 col-sm-2 kill-padding">
                                        <div className="btn btn-md btn-default btn-block typo-style password-style">
                                            <i className={this.state.showPassword ? 'fa fa-eye eye-style' : 'fa fa-eye-slash eye-style'} aria-hidden="true" onClick={this.onEyeClicked.bind(this)}></i>
                                        </div>
                                    </div>
                                    <span className={this.state.pError ? 'error' : 'vamus'}>{this.passwordErrorText}</span>
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

export default Reset;
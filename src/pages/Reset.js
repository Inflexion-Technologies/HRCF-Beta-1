import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/font-awesome/css/font-awesome.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';

import thumb_icon from '../icons/thumb.svg';
import {Link} from 'react-router-dom';

import _ from 'lodash';

import * as utils from '../utils/utils';
import ReactSVG from 'react-svg';

class Reset extends Component {

    constructor(){
        super();
        this.passwordErrorText = 'Please Enter Password';

        this.state = {    
            password : '',
            pError : false,
            signupButtonText : 'Reset',
            isButtonDisabled : false,
            showPassword : false            
        }
    }

    componentWillMount(){
  
        //this.clearCookies();
    }

    componentWillUnMount(){
       
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
            //Set up user
            this.disableButton(true, 'Please Wait ...');

            this.handleBrowserConfig();
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

        return true;
    }

    render() {
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
import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';

import thumb_icon from '../icons/thumb.svg';
import thumb_login_icon from '../icons/fingerprint.svg';
import {Link} from 'react-router-dom';

import SignupStore from '../stores/SignupStore';
import * as SignupAction from '../actions/SignupAction';
import _ from 'lodash';

import * as utils from '../utils/utils';
import cookie from 'react-cookies';
import ReactSVG from 'react-svg';

class Signup extends Component {

    constructor(){
        super();
        
        this.getUser = this.getUser.bind(this);
        this.msisdnError = this.msisdnError.bind(this);
        this.redirect = this.redirect.bind(this);
        this.msisdnExists = this.msisdnExists.bind(this);
        this.msisdnNotExists = this.msisdnNotExists.bind(this);
        this.emailExists = this.emailExists.bind(this);
        this.emailNotExists = this.emailNotExists.bind(this);

        this.fnameErrorText = 'Please Enter First Name';
        this.lnameErrorText = 'Please Enter Last Name';
        this.emailErrorText = 'Please Enter Email';        
        this.msisdnErrorText = 'Please Enter Phone Number';
        this.passwordErrorText = 'Please Enter Password';
        this.user = SignupStore.getUser();

        this.state = {    
            showProgress : false,
            firstname : '',
            lastname : '',
            email : '',
            msisdn : '',
            password : '',
            fError : false,
            lError : false,
            mError : false,
            pError : false,
            signupButtonText : 'Register',
            isButtonDisabled : false
        }
    }

    componentWillMount(){
        SignupStore.on('signup', this.getUser);
        SignupStore.on('signup_complete', this.redirect);
        SignupStore.on('signup_msisdn_error', this.msisdnError);
        SignupStore.on('signup_msisdn_exists', this.msisdnExists);
        SignupStore.on('signup_msisdn_not_exists', this.msisdnNotExists);

        SignupStore.on('signup_email_error', this.emailError);
        SignupStore.on('signup_email_exists', this.emailExists);
        SignupStore.on('signup_email_not_exists', this.emailNotExists);
        
        this.clearCookies();
    }

    componentWillUnMount(){
        SignupStore.removeAllListener('signup', this.getUser);
        SignupStore.removeListener('signup_complete', this.redirect);
        SignupStore.removeListener('signup_msisdn_error', this.msisdnError);
        SignupStore.removeListener('signup_msisdn_exists', this.msisdnExists);
        SignupStore.removeListener('signup_msisdn_not_exists', this.msisdnNotExists);

        SignupStore.removeListener('signup_email_error', this.emailError);
        SignupStore.removeListeneron('signup_email_exists', this.emailExists);
        SignupStore.removeListener('signup_email_not_exists', this.emailNotExists);
    }

    getUser(){
        this.setState({
            user : SignupStore.getUser()
        });
    }

    redirect(){
        this.handleBrowserConfig();
        this.props.history.push('/final');
    }

    msisdnError(){
        this.msisdnErrorText = 'Mobile Number Error';
        
        this.setState({
            mError : true
        })

        this.disableButton(false, 'Register');
    }

    emailError(){
        this.emailErrorText = 'Email Error';
        
        this.setState({
            eError : true
        })

        this.disableButton(false, 'Register');
    }

    msisdnExists(){
        this.msisdnErrorText = 'Mobile Number Already Exist';
        
        this.setState({
            mError : true
        })

        this.disableButton(false, 'Register');
    }

    emailExists(){
        this.emailErrorText = 'Email Already Exist';
        
        this.setState({
            eError : true
        })

        this.disableButton(false, 'Register');
    }

    msisdnNotExists(){
        this.msisdnErrorText = '';
        this.setState({
            mError : false
        })
        
        SignupAction.signupUser(this.user);        
    }

    emailNotExists(){
        this.emailErrorText = '';
        this.setState({
            eError : false
        })

        SignupAction.validateMsisdn(this.user);
        //SignupAction.signupUser(this.user);        
    }

    handleBrowserConfig(){
       
    }

    onFirstnameChanged(evt){
        this.setState({
            firstname : evt.target.value
        })
    }

    onLastnameChanged(evt){
        this.setState({
            lastname : evt.target.value
        })
    }

    onEmailChanged(evt){
        this.setState({
            email : evt.target.value
        })
    }

    onMsisdnChanged(evt){
        this.setState({
            msisdn : evt.target.value
        })
    }

    onPasswordChanged(evt){
        this.setState({
            password : evt.target.value
        })
    }

    onRegisterClicked(){
        if(this.doValidate()){
            //Set up user
            this.disableButton(true, 'Please Wait ...');

            this.grabDetails();
            this.handleBrowserConfig();
            SignupAction.validateEmail(this.user);
            //SignupAction.validateMsisdn(this.user);
        }
    }

    disableButton(isDisable, label){
        this.setState({
            signupButtonText : label,
            isButtonDisabled : isDisable
        });
    }

    grabDetails(){
        this.user.firstname = this.state.firstname.trim();
        this.user.lastname = this.state.lastname.trim();
        this.user.email = this.state.email.trim();        
        this.user.msisdn = this.state.msisdn.trim();
        this.user.password = this.state.password.trim();
        this.user.type = 'O';
    }

    doValidate(){
        if(this.state.firstname && utils.isAlphabets(this.state.firstname)){
            this.setState({
                firstname : _.capitalize(this.state.firstname), 
                fError : false
            })

        }else{
            this.setState({
                 fError : true
            })

            this.fnameErrorText = 'Please Enter Correct First Name';

            return false;
        }

        if(this.state.lastname && utils.isAlphabets(this.state.lastname)){
            this.setState({
                lastname : _.capitalize(this.state.lastname),
                lError: false
            })

        }else{
            this.setState({
                 lError : true
            })

            this.lnameErrorText = 'Please Enter Correct Last Name';

            return false;
        }

        if(this.state.email && utils.isEmail(this.state.email)){
            this.msisdnErrorText = "";
            
            this.setState({
                email : this.state.email, 
                eError : false
            })
        }else{
            this.emailErrorText = "Please Enter Correct Email";
            
            this.setState({
                eError : true
            })

            return false;
        }

        if(this.state.msisdn && utils.isMSISDN(this.state.msisdn)){
            this.msisdnErrorText = "";
            
            this.setState({
                msisdn : this.state.msisdn, 
                mError : false
            })
        }else{
            this.msisdnErrorText = "Please Enter Correct Phone Number";
            
            this.setState({
                mError : true
            })

            return false;
        }

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

    clearCookies(){
        cookie.remove('fname');
        cookie.remove('lname');
        cookie.remove('msisdn');
        cookie.remove('pswd');
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

                <div className="control col-md-4 col-sm-12 col-xs-12">
                    <div className="sign-in-wrapper">
                        <div className="sign-container">
                            <div className="text-center">
                                <h2 className="logo">
                                    <Img src={icam_icon2} className="login-icon" />
                                </h2>
                                <br/>
                                <h4 className="typo-style">Signup</h4>
                            </div>

                            <div className="sign-in-form">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="First Name" value={this.state.firstname} onChange={this.onFirstnameChanged.bind(this)}/>
                                    <span className={this.state.fError ? 'error' : 'vamus'}>{this.fnameErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Last Name" value={this.state.lastname} onChange={this.onLastnameChanged.bind(this)}/>
                                    <span className={this.state.lError ? 'error' : 'vamus'}>{this.lnameErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.onEmailChanged.bind(this)}/>
                                    <span className={this.state.eError ? 'error' : 'vamus'}>{this.emailErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Phone Number" value={this.state.msisdn} onChange={this.onMsisdnChanged.bind(this)}/>
                                    <span className={this.state.mError ? 'error' : 'vamus'}>{this.msisdnErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.onPasswordChanged.bind(this)}/>
                                    <span className={this.state.pError ? 'error' : 'vamus'}>{this.passwordErrorText}</span>
                                </div>
                            
                                <button className="btn btn-info btn-block" onClick={this.onRegisterClicked.bind(this)} disabled={this.state.isButtonDisabled}>{this.state.signupButtonText}</button>
                                <br/>
                            
                                <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
                            </div>
                            <div className="text-center copyright-txt">
                                <small className="typo-style">Inflexion Technologies - Copyright © 2017</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Signup;

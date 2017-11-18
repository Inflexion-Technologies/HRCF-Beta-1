import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/main.css';
import '../../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import icam_icon2 from '../../icons/icam_logo_.png';

import thumb_icon from '../../icons/thumb.svg';
import {Link} from 'react-router-dom';

import CorporateSignupStore from '../../stores/CorporateSignupStore';
import * as CorporateSignupAction from '../../actions/CorporateSignupAction';
import _ from 'lodash';

import * as utils from '../../utils/utils';
import ReactSVG from 'react-svg';

class CStageTwo extends Component {

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
        this.user = CorporateSignupStore.getUser();

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
            isButtonDisabled : false,
            showPassword : false            
        }
    }

    componentWillMount(){
        CorporateSignupStore.on('corporate_signup', this.getUser);
        CorporateSignupStore.on('corporate_signup_complete', this.redirect);
        CorporateSignupStore.on('corporate_signup_msisdn_error', this.msisdnError);
        CorporateSignupStore.on('corporate_signup_msisdn_exists', this.msisdnExists);
        CorporateSignupStore.on('corporate_signup_msisdn_not_exists', this.msisdnNotExists);

        CorporateSignupStore.on('corporate_signup_email_error', this.emailError);
        CorporateSignupStore.on('corporate_signup_email_exists', this.emailExists);
        CorporateSignupStore.on('corporate_signup_email_not_exists', this.emailNotExists);
        
        //this.clearCookies();
    }

    componentWillUnMount(){
        CorporateSignupStore.removeListener('corporate_signup', this.getUser);
        CorporateSignupStore.removeListener('corporate_signup_complete', this.redirect);
        CorporateSignupStore.removeListener('corporate_signup_msisdn_error', this.msisdnError);
        CorporateSignupStore.removeListener('corporate_signup_msisdn_exists', this.msisdnExists);
        CorporateSignupStore.removeListener('corporate_signup_msisdn_not_exists', this.msisdnNotExists);

        CorporateSignupStore.removeListener('corporate_signup_email_error', this.emailError);
        CorporateSignupStore.removeListener('corporate_signup_email_exists', this.emailExists);
        CorporateSignupStore.removeListener('corporate_signup_email_not_exists', this.emailNotExists);
    }

    getUser(){
        this.setState({
            user : CorporateSignupStore.getUser()
        });
    }

    redirect(){
        this.props.history.push('/success');
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
        
        this.user.type = 'C';
        
        console.log('user ::: '+this.user.firstname);
        CorporateSignupAction.corporateSignupUser(this.user);        
    }

    emailNotExists(){
        this.emailErrorText = '';
        this.setState({
            eError : false
        })

        CorporateSignupAction.validateMsisdn(this.user);
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
            CorporateSignupAction.validateEmail(this.user);
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

    grabDetails(){
        const location = this.user.lname;
        const company = this.user.cname;

        this.user = {};
        this.user.firstname = this.state.firstname.trim();
        this.user.lastname = this.state.lastname.trim();
        this.user.email = this.state.email.trim();        
        this.user.msisdn = this.state.msisdn.trim();
        this.user.password = this.state.password.trim();
        this.user.cname = company;
        this.user.lname = location;
        this.user.type = 'C';
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
                                <h4 className="title-typo-style">Personal Details</h4>
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
                            
                                <button className="btn btn-info btn-block" onClick={this.onRegisterClicked.bind(this)} disabled={this.state.isButtonDisabled}>{this.state.signupButtonText}</button>
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

export default CStageTwo;

import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import icam_icon2 from '../../icons/icam_logo_.png';

import thumb_icon from '../../icons/thumb.svg';
import {Link} from 'react-router-dom';

import CorporateSignupStore from '../../stores/CorporateSignupStore';
import * as CorporateSignupAction from '../../actions/CorporateSignupAction';
//import _ from 'lodash';

//import * as utils from '../../utils/utils';
import cookie from 'react-cookies';
import ReactSVG from 'react-svg';

class CStageOne extends Component {

    constructor(){
        super();
        
        this.getUser = this.getUser.bind(this);

        this.cNameExists = this.cNameExists.bind(this);
        this.cNameNotExists = this.cNameNotExists.bind(this);

        this.cNameErrorText = 'Please Enter Corporate Name';
        this.locationErrorText = 'Please Enter Location';

        this.user = CorporateSignupStore.getUser();
        this.nextButtonText = 'Next';

        this.state = {    
           cError : false,
           cname : '',
           lname : ''
        }
    }

    componentWillMount(){
        CorporateSignupStore.on('corporate_signup_corporate_exist', this.cNameExists);
        CorporateSignupStore.on('corporate_signup_corporate_not_exist', this.cNameNotExists);
        this.clearCookies();
    }

    componentWillUnMount(){
        CorporateSignupStore.removeListener('corporate_signup_email_exist', this.emailExists);
        CorporateSignupStore.removeListener('corporate_signup_email_not_exist', this.emailNotExists);
    }

    redirect(){
        this.props.history.push('/corporate_2');        
    }

    getUser(){
        this.setState({
            user : CorporateSignupStore.getUser()
        });
    }

    cNameExists(){
        this.cNameErrorText = 'Corporate Name Already Exist';
        
        this.setState({
            cError : true
        })

        this.disableButton(false, 'Next');
    }

    cNameNotExists(){
        //this.cNameErrorText = '';

        this.setState({
            cError : false
        })

        this.disableButton(false, 'Next');

        //Save User
        CorporateSignupStore.initUser(this.user);

        this.redirect();   
    }

    handleBrowserConfig(){
        cookie.save('cname', this.state.cname);
        cookie.save('lname', this.state.lname);
    }

    onCompanyChanged(evt){
        this.setState({
            cname : evt.target.value
        })
    }

    onLocationChanged(evt){
        this.setState({
            lname : evt.target.value
        })
    }

    onNextClicked(){
        if(this.doValidate()){
            //Set up user
            this.disableButton(true, 'Please Wait ...');

            this.grabDetails();
            this.handleBrowserConfig();
            CorporateSignupAction.isCorporateExist(this.user);

            //For Testing purposes
            // this.props.history.push('/corporate_2');
           
        }
    }

    disableButton(isDisable, label){
        this.setState({
            signupButtonText : label,
            isButtonDisabled : isDisable
        });
    }

    grabDetails(){
        this.user.cname = this.state.cname.trim();
        this.user.lname = this.state.lname.trim();
    }

    doValidate(){
        if(this.lname){
        }


        return true;
    }

    clearCookies(){
       
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
                                <h4 className="title-typo-style">Corporate Details</h4>
                            </div>

                            <div className="sign-in-form">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Corporate Name" value={this.state.cname} onChange={this.onCompanyChanged.bind(this)}/>
                                    <span className={this.cError ? 'error' : 'vamus'}>{this.cNameErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Location" value={this.state.lname} onChange={this.onLocationChanged.bind(this)}/>
                                    <span className={this.lError ? 'error' : 'vamus'}>{this.locationErrorText}</span>
                                </div>
                            
                                <button className="btn btn-info btn-block" onClick={this.onNextClicked.bind(this)} disabled={this.state.isButtonDisabled}>{this.nextButtonText}</button>
                                <br/>
                            
                                <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
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

export default CStageOne;

import React, { Component } from 'react';
import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/main.css';
import '../../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import icam_icon2 from '../../icons/icam_logo_.png';

import thumb_icon from '../../icons/thumb.svg';
import {Link} from 'react-router-dom';

import SignupStore from '../../stores/SignupStore';
//import * as SignupAction from '../../actions/SignupAction';
//import _ from 'lodash';

//import * as utils from '../../utils/utils';
import cookie from 'react-cookies';
import ReactSVG from 'react-svg';

class CStageOne extends Component {

    constructor(){
        super();
        
        this.getUser = this.getUser.bind(this);

        this.cNameErrorText = 'Please Enter Corporate Name';
        this.locationErrorText = 'Please Enter Location';

        this.cName = '';
        this.lName = '';
        this.user = SignupStore.getUser();
        this.nextButtonText = 'Next';

        this.state = {    
           
        }
    }

    componentWillMount(){
                
        this.clearCookies();
    }

    componentWillUnMount(){
        
    }

    getUser(){
        this.setState({
            user : SignupStore.getUser()
        });
    }

    cNameExists(){
        this.cNameErrorText = 'Corporate Name Already Exist';
        
        this.setState({
            cNameError : true
        })

        this.disableButton(false, 'Next');
    }

    cNameNotExists(){
        this.cNameErrorText = '';
              
    }

    handleBrowserConfig(){
        cookie.save('cname', this.cName);
        cookie.save('clocation', this.lName);
    }

    onNextClicked(){
        if(this.doValidate()){
            //Set up user
            this.disableButton(true, 'Please Wait ...');

            this.grabDetails();
            this.handleBrowserConfig();
            //SignupAction.isCorporateExist(this.user);

            //For Testing purposes
            this.props.history.push('/corporate_2');
           
        }
    }

    disableButton(isDisable, label){
        this.setState({
            signupButtonText : label,
            isButtonDisabled : isDisable
        });
    }

    grabDetails(){
        this.user.cname = this.cName.trim();
        this.user.lname = this.lName.trim();
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
                                    <input type="text" className="form-control" placeholder="Corporate Name" value={this.cName} />
                                    <span className={this.cError ? 'error' : 'vamus'}>{this.cNameErrorText}</span>
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Location" value={this.lName} />
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

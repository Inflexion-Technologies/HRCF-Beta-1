import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';
import thumb_icon from '../icons/ssbb.svg';
import {Link} from 'react-router-dom';

import LoginStore from '../stores/LoginStore';
import * as LoginAction from '../actions/LoginAction';
import * as utils from '../utils/utils';
import cookie from 'react-cookies';

import ReactSVG from 'react-svg';


class Login extends Component {
    constructor(){
        super();
        //LoginAction.registerSession();

        this.onLogin = this.onLogin.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onLoginFailed = this.onLoginFailed.bind(this);
        this.onLoginReady = this.onLoginReady.bind(this);
        this.usernameErrorMessage = 'please enter a valid email/phone number';

        this.state={
            login : LoginStore.getLogin(),
            username : '',
            password : '',
            loginButtonText : 'Login',
            isButtonDisabled: false,
            uError : false
        }

        LoginStore.resetCookies();        
    }

    componentWillMount(){
        LoginStore.resetCookies();
        LoginStore.on('login_ready', this.onLoginReady);
        LoginStore.on('login', this.onLogin);
        LoginStore.on('login_success', this.onLoginSuccess);
        LoginStore.on('login_failed', this.onLoginFailed);

        this.clearCookies();
    }

    componentWillUnMount(){
        LoginStore.removeListener('login', this.onLogin);
        LoginStore.removeListener('login_success', this.onLoginSuccess);
        LoginStore.removeListener('login_failed', this.onLoginFailed);
        LoginStore.removeListener('login_ready', this.onLoginReady);
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.onLoginClicked();
        }
      }

    clearCookies(){
        cookie.remove('fname');
        cookie.remove('lname');
        cookie.remove('msisdn');
        cookie.remove('pswd');
    }

    onLogin(){
        this.usernameErrorMessage = 'please enter a valid email/phone number';                       
        this.setState({
            login : LoginStore.getLogin()
        });
        this.disableLoginButton(false, 'Login');        
    }

    onLoginSuccess(){
        this.disableLoginButton(false, 'Login'); 
        this.redirect('/app/dashboard');
    }

    onLoginFailed(){
        this.disableLoginButton(false, 'Login');
        this.usernameErrorMessage = 'Username or Password is incorrect';
        this.setState({
            uError : true
        })
    }

    onLoginClicked(e){
                
        this.disableLoginButton(true, 'Please Wait ...');

        if(this.state.username.trim().length === 0){
            this.setState({
                uError : true
            })

            this.usernameErrorMessage = 'username must not be empty';
            this.disableLoginButton(false, 'Login');
            return;
        }

        if(utils.isMSISDN(this.state.username)){
            this.usernameErrorMessage = '';
            this.setState({
                uError : false
            })
            if(!(this.state.password.length > 5)){
                this.passwordErrorMessage = 'password length must be six(6) or more'
                this.setState({
                    pError : true
                })

                this.disableLoginButton(false, 'Login');
                return;  
            }else{
                this.setState({
                    pError : false
                })
                this.passwordErrorMessage = '';                
                LoginAction.login(this.state.username, this.state.password);
            }
        }else if(utils.isEmail(this.state.username)){
            this.usernameErrorMessage = '';
            this.setState({
                uError : false
            })
            if(!(this.state.password.length > 5)){
                this.passwordErrorMessage = 'password length must be six(6) or more'
                
                this.setState({
                    pError : true
                })

                this.disableLoginButton(false, 'Login');
                return;                
            }else{
                this.setState({
                    pError : false
                })
                this.passwordErrorMessage = '';                                
                LoginAction.login(this.state.username, this.state.password);
            }  
        }else{
            this.setState({
                uError : true
            })

            this.disableLoginButton(false, 'Login');
            return;
        }
    }

    onLoginReady(){
        this.disableLoginButton(false, 'Login');
    }

    disableLoginButton(isDisable, text){
        this.setState({
            loginButtonText : text,
            isButtonDisabled : isDisable
        });
    }

    redirect(link){
        this.props.history.push(link);
    }

    onUsernameChange(evt){
        this.setState({
            username : evt.target.value
        })
    }

    onPasswordChange(evt){
        this.setState({
            password : evt.target.value
        })
    } 

    render() {
        return (
            <div className="login">
                <div className="ad col-md-8 hidden-sm hidden-xs">
                    <div>
                        <Img src={icam_icon} className="icon" />
                    </div>
                    <div className="col-md-12 target">
                        <ReactSVG path={thumb_icon} callback={svg => {}} className="svg"/>
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
                                <h4 className="title-typo-style">Login</h4>
                            </div>

                            <div className="sign-in-form">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Email/Phone" value={this.state.username} onChange={this.onUsernameChange.bind(this)} />
                                    <span className={this.state.uError ? 'error' : 'vamus'}>{this.usernameErrorMessage}</span>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange.bind(this)} onKeyPress={this.handleKeyPress}/>
                                    <span className={this.state.pError ? 'error' : 'vamus'}>{this.passwordErrorMessage}</span>
                                </div>
                            
                                <button className="btn btn-info btn-block" onClick={this.onLoginClicked.bind(this)} disabled={this.state.isButtonDisabled}>{this.state.loginButtonText}</button>
                                <div className="text-center help-block">
                                    <a href="#/"><small className="typo-style">Forgot password?</small></a>
                                    <p className="text-muted help-block"><small className="typo-style">Do not have an account?</small></p>
                                </div>
                                <Link to="/signup" className="btn btn-md btn-default btn-block typo-style">Create an account</Link>
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

export default Login;
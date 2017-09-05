import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import thumb_icon from '../icons/thumb.svg';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import ThankYouStore from '../stores/ThankYouStore';
import CountDown from './CountDownTimer';


import ReactSVG from 'react-svg';


class ThankYou extends Component {
    constructor(){
        super();

        this.state={
            user : {},           
        }
    }

    componentWillMount(){
        ThankYouStore.on('final', ()=>{
            this.setState({
                user : ThankYouStore.getUser()
            })
        });

        ThankYouStore.init();
    }

    redirectToApp(){
        this.redirect('/app');
    }

    redirect(link){
        this.props.history.push(link);
    }

    getUser(){

        if(this.state.user.firstname){
            return _.capitalize(this.state.user.firstname)+'!';
        }

        return '!';
    }

    stop(){
        this.redirectToApp();        
    }

    render() {
        return (
            <div className="review">
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
                                
                                <h3 className="typo-style">Congratulations {this.state.user.firstname}</h3>
                            </div>

                            <div className="sign-in-form">
                                <div className="form-group message">
                                    <span>You have successfully registered on the platform. You will be automatically logged in 
                                        <span><CountDown duration={10} stop={this.stop.bind(this)}/></span>secs. Thank you.</span>
                                    <span></span>
                                </div>

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

export default ThankYou;
import React, { Component } from 'react';
import '../bower_components/bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import '../styles/custom.css';
import Img from 'react-image';
import icam_icon from '../icons/icam_logo.png';
import icam_icon2 from '../icons/icam_logo_.png';

import thumb_icon from '../icons/thumb.svg';
import {Link} from 'react-router-dom';
//import _ from 'lodash';

//import * as utils from '../utils/utils';
//import cookie from 'react-cookies';
import ReactSVG from 'react-svg';

class ClientType extends Component {

    // constructor(){
    //     super();
        
    // }

    componentWillMount(){
        //this.clearCookies();
    }

    componentWillUnMount(){
    }

    handleBrowserConfig(){
       
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
                                    <br/>
                                </h2>
                                <br/>
                                <h4 className="title-typo-style">Account Type</h4>
                            </div>

                            <div className="sign-in-form">
                                <div className="form-group">
                                    <Link to="/individual" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style"><div className="anchor-text">INDIVIDUAL</div></a></Link>                                
                                </div>
                                <div className="form-group">
                                    <Link to="/corporate" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style"><div className="anchor-text">CORPORATE</div></a></Link>
                                </div>

                                <br/>
                            
                                <Link to="/login" className="typo-style"><a className="btn btn-md btn-default btn-block typo-style">Go Back to Login</a></Link>
                            </div>
                            <div className="text-center copyright-txt">
                                <small className="typo-style">Inflexion - Copyright © 2017</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClientType;

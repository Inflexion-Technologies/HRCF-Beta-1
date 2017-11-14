
import React, { Component } from 'react';

import Options from './fund_components/Options'

import * as TransactionAction from '../../actions/TransactionAction'
import CorporateOverlay from './corporate_overlay/CorporateOverlay';
import IndividualOverlay from './individual_overlay/IndividualOverlay';
import OverlayStore from '../../stores/OverlayStore'

import WithdrawStore from '../../stores/WithdrawStore'
import TransactionStore from '../../stores/TransactionStore'
import cookie from 'react-cookies';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';
import { Redirect } from 'react-router';


//import _ from 'lodash';

class Profile extends Component {

    constructor(props){
        super(props);
        this.state = {
            count : 0,
            redirect : false
        }
        this.pageNumber = 1;
        this.redirectPage = this.redirectPage.bind(this);
    }

  componentWillMount(){
    OverlayStore.on('overlay_update_successful', this.redirectPage);
  }

  componentWillUnMount(){
   
  }

  redirectPage(){
    this.setState({
        redirect : true
    })
  }

  showTypeOfProfile(){
    if((cookie.load('is_complete') === 'false') && (cookie.load('type') === 'C')){
        return <CorporateOverlay show={true}></CorporateOverlay>
    }else if((cookie.load('is_complete') === 'false') && (cookie.load('type') === 'I')){
        return <IndividualOverlay show={true}></IndividualOverlay>
    }else if(cookie.load('is_complete') === 'true'){
        this.redirectPage();
    }
  }

  render() {
    if(this.state.redirect){
        return (
          <Redirect push to="/app/dashboard"/>        
        );
    }

    return (
            <div>
                <div className="profile">
                    {this.showTypeOfProfile()}
                </div>
            </div>
    );
 }

}

export default Profile;

import React, { Component } from 'react';
import Img from 'react-image';
import icam_icon from '../../icons/icam_logo.png';
import {Link} from 'react-router-dom';
import MainStore from '../../stores/MainStore'

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Header extends Component {
  constructor(props){
    super(props);
    this.state ={
      count : 0
    }

    this.showDrop = false;
  }

  componentWillMount(){

  }

  refresh(){
    this.setState({
      count : this.state.count + 1
    })
  }

  toggleUser(){
   this.showDrop = !this.showDrop;
   this.refresh();
  }

  onOpen(evt){
    this.props.show();
  }

  toggleMobileSideView(){
    console.log('Got to IT');
    this.props.showdrawer(true);    
    //this.refresh();
  }

  render() {
    return (
      <div className="header">
        <i className='hidden-md hidden-lg fa fa-bars header-switch-icon' aria-hidden="true" onClick={this.toggleMobileSideView.bind(this)}></i>
        <Img src={icam_icon} className="header-logo-icon" />
        <div className="hidden-xs header-user">
          {this.props.user}
        </div>
          <i className="hidden-xs hidden-sm fa fa-user-circle-o header-avatar-icon" aria-hidden="true" onClick={this.toggleUser.bind(this)}></i>
          {/* <i className="hidden-lg hidden-md fa fa-user-circle-o header-avatar-icon" style={{color : '#00838f'}} aria-hidden="true" onClick={this.toggleUser.bind(this)}></i> */}
          <div className="clearfix"></div>
          <div className={this.showDrop ? 'logout': 'logout vamus'}>
            <div className="dropdown">
              <div className="item-label"># - {MainStore.getUser().payment_id}</div>
              <div className="clearfix"></div>
              <div className="item-label"></div>
              <div className="clearfix"></div>
              <hr style={{marginTop : '0', marginBottom : '0'}}/>
              <div className="clearfix"></div>
              <div className="item">
                <Link to="/login"> <i className="fa fa-sign-out" aria-hidden="true" style={{padding: "0 20px 0 0"}}></i>Logout
                </Link>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
  
        <div className="clearfix"></div>
        <div className="row">
          {/* <div className="hidden-md hidden-lg col-xs-12 hidden-menu">
            <Link to="/app/dashboard" ><div className="col-xs-3">Home</div></Link>
            <div className="col-xs-3">History</div>
            <Link to="/app/withdraw" ><div className="col-xs-3">Withdraw</div></Link>
            <div className="col-xs-3">Top-Up</div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Header;
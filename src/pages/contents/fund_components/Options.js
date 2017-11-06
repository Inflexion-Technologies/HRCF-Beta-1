import React, { Component } from 'react';
import Img from 'react-image';

import OverlayStore from '../../../stores/OverlayStore';
// import * as OverlayAction from '../../../actions/OverlayAction';
import WithdrawStore from '../../../stores/WithdrawStore'
// import NumberFormat from 'react-number-format'
import {Link} from 'react-router-dom';

import mobile_money from '../../../icons/mobile_money.png';
import visa from '../../../icons/visa.png';
import master_card from '../../../icons/master_card.png';
import bank_transfer from '../../../icons/bank_transfer.png';
import wallet from '../../../icons/wallet.svg';


import '../../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../../styles/font-awesome/css/font-awesome.css';
import '../../../styles/custom.css';

import ReactSVG from 'react-svg';
//import _ from 'lodash';

class Options extends Component {
  constructor(props){
    super(props);
    this.state = {
      count : 0
    }
  }

  componentWillMount(){
  }

  componentWillUnMount(){
  }
 

  render() {
    let show = false;
    if(this.props.page === parseInt(this.props.pageNumber)){
      show = true;

      return (
              <div className="col-md-12 stage">
              <div className="col-md-4 sider hidden-xs">
                  <div className="col-md-12 target logo">
                      <ReactSVG path={wallet} callback={svg => {}} className="svg"/>
                  </div>
              </div>
              <div className="col-md-8 wcontent" style={{color: '#c62828'}}>
                <div className="col-md-3"></div>
                <div className="col-md-6 wpanel">
                  <div className="content-height">
                    <div className="input-style" style={{fontWeight: '600',fontSize: '14px', color: '#c62828'}}>Fund My Account</div>

                    <div className="form-group no-funds-style" style={{height : '80%', color:'#c62828'}}>
                      <div>Dear {OverlayStore.getFirstName()}, </div>
                      <div>Always include your IC Asset Managers account number when making a deposit into your investment account</div>
                      <div className="breaker"></div>
                      <div>
You may fund your investment account through any of our partner banks by 
Cash deposit at a branch  Wire transfer/Internet banking </div>
<div>
<br />
{/* Our bank details */}
<br/>
<span className="bank-details-style">Guaranty Trust Bank,</span>
<div className="clearfix"></div>
<span className="bank-details-style"> Head Office,</span>
<div className="clearfix"></div>
<span className="bank-details-style"> 2011114750110</span>
</div>
                      <div className="clearfix"></div>
                    </div>
<br/>
                    <div className="col-md-12">
                        <div className="col-md-4 col-xs-4">
                            <Img src={visa} style={{width: '100%'}} />
                        </div>
                        <div className="col-md-4 col-xs-4">
                            <Img src={master_card} style={{width: '100%'}} />
                        </div>
                        <div className="col-md-4 col-xs-4">
                            <Img src={mobile_money} style={{width: '100%'}} />
                        </div>
                    </div>
                 </div>

                </div>
                <div className="col-md-3"></div>

              </div>
                  
                
            </div>
      );


    }else{
      return null
    }

  }
}

export default Options;
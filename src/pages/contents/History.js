import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import HistoryStore from '../../stores/HistoryStore';
import * as HistoryAction from '../../actions/HistoryAction';
import dateFormat from 'dateformat';
import format from 'format-number';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class History extends Component {

    constructor(){

        super();
        this.state = {
            count : 0
        }
        this.refresh = this.refresh.bind(this);

    }

  componentWillMount(){
    HistoryAction.loadTransactionHistory();
    HistoryStore.on('history_user', this.refresh);
  }

  refresh(){
      this.setState({
          count : this.state.count + 1
      })
  }

  getLongDate(date){
    const dateFormat = require('dateformat');

    return dateFormat(new Date(date), 'dddd, mmmm dS, yyyy');
  }

  getShortDate(date){
    const dateFormat = require('dateformat');
    
    return dateFormat(new Date(date), 'dd-mm-yyyy');
  }

  getFormattedNumbers(amount){
    const formatStyle = format({integerSeparator:',', round : 2});
    return formatStyle(amount) === '' ? '0.00':formatStyle(amount);
  }

  constructDesktopHistoryTable(data){
    const app = this;

      return (
      <div>
        <div className="history-header"> 
            <div className="col-md-3 col-lg-3 d-heading">
                Date
            </div>
            <div className="col-md-3 col-lg-3 d-heading">
                Transaction
            </div>
            <div className="col-md-3 col-lg-3 d-heading">
                Amount
            </div>
            <div className="col-md-3 col-lg-3 d-heading">
                Status
            </div>
        </div>
        <div className="history-content">
             {data.map((d)=>{
               return <div>
                        <div className="col-md-3 col-lg-3 d-item">
                            {app.getLongDate(d.date)}
                        </div>
                        <div className="col-md-3 col-lg-3 d-item">
                            {d.transaction}
                        </div>
                        <div className="col-md-3 col-lg-3 d-item">
                            {app.getFormattedNumbers(d.amount)} GHS
                        </div>
                        <div className="col-md-3 col-lg-3 d-item">
                            {d.status}
                        </div>
                    </div>
             })}
        </div>
      </div>)
  }

  constructMobileHistoryTable(data){
    const app = this;

      return (
      <div>
        <div className="history-header"> 
            <div className="col-xs-4 col-sm-4 m-heading">
                Date
            </div>
            <div className="col-xs-4 col-sm-4 m-heading">
                Transaction
            </div>
            <div className="col-xs-4 col-sm-4 m-heading">
                Amount
            </div>
        </div>
        <div className="history-content">
             {data.map((d)=>{
               return <div>
                        <div className="col-xs-4 col-sm-4 m-item">
                            {app.getShortDate(d.date)}
                        </div>
                        <div className="col-xs-4 col-sm-4 m-item">
                            {d.transaction}
                        </div>
                        <div className="col-xs-4 col-sm-4 m-item">
                            {app.getFormattedNumbers(d.amount)} GHS
                        </div>
                    </div>
             })}
        </div>
      </div>)
  }






  render() {
    return (
           <div className="row history">
               <div className="hidden-xs hidden-sm col-md-12 col-lg-12">
                   {this.constructDesktopHistoryTable(HistoryStore.getData())}
                </div>

                <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                   {this.constructMobileHistoryTable(HistoryStore.getData())}
                </div>
           </div>
    );
  }
}

export default History;

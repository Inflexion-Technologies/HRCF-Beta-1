import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import MainStore from '../../stores/MainStore';
import * as MainAction from '../../actions/MainAction';

import '../../bower_components/bootstrap/dist/css/bootstrap.css';
import '../../styles/font-awesome/css/font-awesome.css';
import '../../styles/custom.css';

//import _ from 'lodash';

class Dashboard extends Component {

    constructor(){

        super();
        this.state = {
            count : 0
        }
        this.refresh = this.refresh.bind(this);
        this.line_config={
            
            title: {
                text: 'Total Earns'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              },
              series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
              }]
        }

        this.bar_config={
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Fund Performance'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Fund Performance'
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Balance',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'Interest',
                data: [2, 2, 3, 2, 1]
            }]
        }

        this.pie_config={
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Funds Allocation'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (ReactHighcharts.theme && ReactHighcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: '30-182 Day Bank Deposit',
                    y: 15
                }, {
                    name: '91-Day GoG/BoG Securities',
                    y: 30,
                    sliced: true,
                    selected: true
                }, {
                    name: '91-Day Fixed Deposit',
                    y: 10
                }, {
                    name: '180-Day GoG/BoG Securities',
                    y: 20
                }, {
                    name: '182-Day Fixed Deposit',
                    y: 5
                }, {
                    name: '1 year GoG/BoG Note',
                    y: 5
                }, {
                    name: 'Medium term GoG/BoG Securities',
                    y: 5
                }]
            }]
        }
    }

  componentWillMount(){
     MainAction.loadTotalBalance();
     MainAction.loadTotalContribution();
     MainAction.loadTotalInterest();

     MainStore.on('dashboard_user_balance', this.refresh);
     MainStore.on('dashboard_user_contribution', this.refresh);
     MainStore.on('dashboard_user_interest', this.refresh);
  }

  refresh(){
      this.setState({
          count : this.state.count + 1
      })
  }

  render() {
    return (
            <div>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-md-4 kill-padding-except-left">
                        <div className="dash-widget-contribution">
                            <div className="label">Total Contribution</div>
                            <div className="amount">{MainStore.getContribution()} GHS</div>
                        </div>
                    </div>

                    <div className="hidden-xs hidden-sm col-md-4 kill-padding">
                        <div className="dash-widget-balance">
                            <div className="label">Total Interest</div>
                            <div className="amount">{MainStore.getInterest()} GHS</div>
                        </div>
                    </div>

                    <div className="hidden-xs hidden-sm col-md-4 kill-padding-except-right">
                        <div className="dash-widget-available-balance">
                            <div className="label">Available Balance</div>
                            <div className="amount">{MainStore.getAvailableBalance()} GHS</div>
                        </div>
                    </div>


                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-contribution">
                            <div className="label">Total Contribution</div>
                            <div className="amount">{MainStore.getContribution()} GHS</div>
                        </div>
                    </div>

                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-balance">
                            <div className="label">Total Interest</div>
                            <div className="amount">{MainStore.getInterest()} GHS</div>
                        </div>
                    </div>

                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-available-balance">
                            <div className="label">Available Balance</div>
                            <div className="amount">{MainStore.getAvailableBalance()} GHS</div>
                        </div>
                    </div>


                </div>
                {/* Content */}
                <div className="row">
                    <div className="col-md-12">
                        <ReactHighcharts config={this.line_config}></ReactHighcharts>
                    </div>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-left">
                        <ReactHighcharts config={this.bar_config}></ReactHighcharts>
                    </div>
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-right">
                        <ReactHighcharts config={this.pie_config}></ReactHighcharts>
                    </div>


                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        <ReactHighcharts config={this.bar_config}></ReactHighcharts>
                    </div>
                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        <ReactHighcharts config={this.pie_config}></ReactHighcharts>
                    </div>
                </div>
        </div>
    );
  }
}

export default Dashboard;

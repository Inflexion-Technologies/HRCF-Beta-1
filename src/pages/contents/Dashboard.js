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
    }

  componentWillMount(){
     MainAction.loadTotalBalance();
     MainAction.loadTotalContribution();
     MainAction.loadTotalInterest();

     MainAction.loadFundAllocationPie();
     MainAction.loadNAV();
     MainAction.loadInterestPerformance();

     MainStore.on('performance_interest_success', this.refresh);
     MainStore.on('nav_success', this.refresh);
     MainStore.on('dashboard_user_balance', this.refresh);
     MainStore.on('dashboard_user_contribution', this.refresh);
     MainStore.on('dashboard_user_interest', this.refresh);
     MainStore.on('fund_allocation_pie_success', this.refresh);
  }

  renderInterest(series, categories){
    const line_config={
        
        title: {
            text: 'Total Earnings Performance'
        },
        subtitle: {
            text: 'Interest Earned Daily'
        },
        yAxis: {
            title: {
                text: 'Amount (GHS)'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        xAxis: {
            categories: categories
        },
        series: [{
            name : 'Interest',
            data: series
        }]
    }

    return <ReactHighcharts config={line_config}></ReactHighcharts>    
  }

  renderNAV(series, categories){
    const line_config={
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Net Asset Value Performance'
        },
        subtitle: {
            text: 'Past 7 days Performance'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Percent Change'
            }
        },
        legend : {
            layout : 'vertical',
            align : 'right',
            verticalAlign : 'middle'
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        // [0, ReactHighcharts.getOptions().colors[0]],
                        // [1, ReactHighcharts.Color(ReactHighcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'NAV Performance',
            data: series
        }]
    }

    return <ReactHighcharts config={line_config}></ReactHighcharts>    
  }

  renderFundsAllocation(data){
    const pie_config={
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
            name: ' ',
            colorByPoint: true,
            data: data
        }]
    }

    return <ReactHighcharts config={pie_config}></ReactHighcharts>
    
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
                            <div className="amount">GHS {MainStore.getContribution()}</div>
                        </div>
                    </div>

                    <div className="hidden-xs hidden-sm col-md-4 kill-padding">
                        <div className="dash-widget-balance">
                            <div className="label">Total Earnings</div>
                            <div className="amount">GHS {MainStore.getInterest()}</div>
                        </div>
                    </div>

                    <div className="hidden-xs hidden-sm col-md-4 kill-padding-except-right">
                        <div className="dash-widget-available-balance">
                            <div className="label">Available Balance</div>
                            <div className="amount">GHS {MainStore.getAvailableBalance()}</div>
                        </div>
                    </div>


                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-contribution">
                            <div className="label">Total Contribution</div>
                            <div className="amount">GHS {MainStore.getContribution()}</div>
                        </div>
                    </div>

                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-balance">
                            <div className="label">Total Interest</div>
                            <div className="amount">GHS {MainStore.getInterest()}</div>
                        </div>
                    </div>

                    <div className="hidden-md hidden-lg col-xs-12 col-sm-12">
                        <div className="dash-widget-available-balance">
                            <div className="label">Available Balance</div>
                            <div className="amount">GHS {MainStore.getAvailableBalance()}</div>
                        </div>
                    </div>


                </div>
                {/* Content */}
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        {this.renderInterest(MainStore.getInterestSeries(), MainStore.getInterestCategory())}
                    </div>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-left">
                        {this.renderNAV(MainStore.getNavSeries(), MainStore.getNavCategories())}
                    </div>
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-right">
                        {this.renderFundsAllocation(MainStore.getPieData())}
                    </div>


                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        {this.renderNAV(MainStore.getNavSeries(), MainStore.getNavCategories())}
                    </div>
                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        {this.renderFundsAllocation(MainStore.getPieData())}
                    </div>
                </div>
        </div>
    );
  }
}

export default Dashboard;

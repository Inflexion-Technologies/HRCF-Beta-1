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

  renderLine(series, categories){
    const line_config={
        
        title: {
            text: 'Total Interest Performance'
        },
        xAxis: {
            categories: categories
          },
          series: [{
            data: series
          }]
    }

    return <ReactHighcharts config={line_config}></ReactHighcharts>    
  }

  renderBar(series, categories){
    const bar_config={
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Net Asset Value Performance'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Performance'
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
            name: 'Unit',
            data: series
        }]
    }

    return <ReactHighcharts config={bar_config}></ReactHighcharts>    
  }

  renderPie(data){
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
            name: 'Instruments',
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
                            <div className="label">Total Interest</div>
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
                        {this.renderLine(MainStore.getInterestSeries(), MainStore.getInterestCategory())}
                    </div>
                </div>
                <div className="row breaker"></div>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-left">
                        {this.renderBar(MainStore.getNavSeries(), MainStore.getNavCategories())}
                    </div>
                    <div className="hidden-xs hidden-sm col-lg-6 col-md-6 kill-padding-except-right">
                        {this.renderPie(MainStore.getPieData())}
                    </div>


                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        {this.renderBar(MainStore.getNavSeries(), MainStore.getNavCategories())}
                    </div>
                    <div className="hidden-lg hidden-md col-xs-12 col-sm-12">
                        {this.renderPie(MainStore.getPieData())}
                    </div>
                </div>
        </div>
    );
  }
}

export default Dashboard;

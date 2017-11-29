import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';
import format from 'format-number';


class MainStore extends EventEmitter{
    constructor(){
        super();
        this.available_balance = 0;
        this.actual_balance = 0;
        this.interest = 0;
        this.contribution = 0;

        this.interestCategories = [];
        this.interestSeries = [];

        this.navCategories = [];
        this.navSeries = [];
    }

    getUser(){
        this.user = {};
        this.user.id = cookie.load('id');
        this.user.firstname = cookie.load('firstname');
        this.user.lastname = cookie.load('lastname');
        this.user.msisdn = cookie.load('msisdn');
        this.user.email = cookie.load('email');
        this.user.payment_id = cookie.load('payment_id');
        this.user.type = cookie.load('type');

        return this.user;
    }

    doDashboardUserBalance(data){
        this.actual_balance = data.actual_balance;            
        this.available_balance = data.available_balance;
        
        console.log('Balances set ...');
        this.emit('dashboard_user_balance');
    }

    doDashboardUserContribution(data){
        this.contribution = data.contribution;
        this.emit('dashboard_user_contribution');
    }

    doDashboardUserInterest(data){
        this.interest = data.interest;
        this.emit('dashboard_user_interest');            
    }

    doForgotRequest(status){
        if(status){
            this.emit('forgot_request_success');
        }else{
            this.emit('forgot_request_failed');
        }
    }

    doResetRequest(status){
        if(status){
            this.emit('reset_success');
        }else{
            this.emit('reset_failed')
        }
    }

    doLoadFundAllocationPie(data){
        if(data){
            this.pie_data = data;
            this.emit('fund_allocation_pie_success');
        }
    }

    doLoadFundAllocationPieFailed(){
        this.pie_data = [];
    }

    doNAVSuccess(data){
        if(data){
            let categories = [];
            let series = [];
             
            data.map((d)=>{
                categories.push(d.date);
                series.push(d.unit);
            });

            this.navCategories = categories;
            this.navSeries = series;

            this.emit('nav_success');
        }
    }

    doInterestDataSuccess(data){
        if(data){
            //Group data
            let categories = [];
            let series = [];
             
            data.map((d)=>{
                categories.push(d.date);
                series.push(d.amount);
            });

            this.interestCategories = categories;
            this.interestSeries = series;

            this.emit('performance_interest_success');
        }
    }

    broadcastClick(){
        this.emit('main_click_triggered');
    }

    clearCookies(){
        cookie.remove('firstname');
        cookie.remove('lastname');
        cookie.remove('is_admin');
        cookie.remove('payment_number');
        cookie.remove('token');
        cookie.remove('msisdn');
        cookie.remove('email');
        cookie.remove('id');
        cookie.remove('is_complete');   
        cookie.remove('type');
        //cookie.remove('');
        //cookie.remove('');
        
    }

    getInterestCategory(){
        return this.interestCategories;
    }

    getInterestSeries(){
        return this.interestSeries;
    }

    getUserName(){
        return this.getUser().firstname +' '+this.getUser().lastname;
    }

    getPaymentCode(){
        return this.getUser().payment_id;
    }

    getActualBalance(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.actual_balance) === '' ? '0.00':formatStyle(this.actual_balance);
    }

    getAvailableBalance(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.available_balance) === '' ? '0.00':formatStyle(this.available_balance);
    }

    getContribution(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.contribution) === '' ? '0.00':formatStyle(this.contribution);
    }

    getInterest(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.interest) === '' ? '0.00':formatStyle(this.interest);
    }

    getPieData(){
        return this.pie_data;
    }

    getNavCategories(){
        return this.navCategories;
    }

    getNavSeries(){
        return this.navSeries;
    }

    handleActions(action){
        switch(action.type){
            case 'DASHBOARD_USER_BALANCE' : {
                this.doDashboardUserBalance(action.data);
                break;
            } 
            case 'DASHBOARD_USER_INTEREST' : {
                this.doDashboardUserInterest(action.data);
                break;
            } 
            case 'DASHBOARD_USER_CONTRIBUTION' : {
                this.doDashboardUserContribution(action.data);
                break;
            } 
            case 'FORGOT_REQUEST_SUCCESS' : {
                this.doForgotRequest(true);
                break;
            } 
            case 'FORGOT_REQUEST_FAILED' : {
                this.doForgotRequest(false);
                break;
            } 
            case 'RESET_REQUEST_SUCCESS' : {
                this.doResetRequest(true);
                break;
            } 
            case 'RESET_REQUEST_FAILED' : {
                this.doResetRequest(false);
                break;
            } 
            case 'PIE_DATA_SUCCESS' : {
                this.doLoadFundAllocationPie(action.data);
                break;
            } 
            case 'PIE_DATA_FAILED' : {
                this.doLoadFundAllocationPieFailed();
                break;
            } 
            case 'NAV_DATA_SUCCESS' : {
                this.doNAVSuccess(action.data);
                break;
            } 
            case 'INTEREST_DATA_SUCCESS' : {
                this.doInterestDataSuccess(action.data);
                break;
            } 
            default:{}
        }
    }

}

const mainStore = new MainStore();
dispatcher.register(mainStore.handleActions.bind(mainStore));

export default mainStore;
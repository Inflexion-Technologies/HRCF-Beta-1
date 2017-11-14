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
    }

    initUser (...user){
        this.user = user;
        this.emit('main');
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
        this.interest = data.credit;
        this.emit('dashboard_user_interest');            
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

    handleActions(action){
        switch(action.type){
            case 'DASHBOARD_USER_BALANCE' : {
                this.doDashboardUserBalance(action.data);
                break;
            } 
            case 'DASHBOARD_USER_BALANCE' : {
                this.doDashboardUserInterest(action.data);
                break;
            } 
            case 'DASHBOARD_USER_CONTRIBUTION' : {
                this.doDashboardUserContribution(action.data);
                break;
            } 
            default:{}
        }
    }

}

const mainStore = new MainStore();
dispatcher.register(mainStore.handleActions.bind(mainStore));

export default mainStore;
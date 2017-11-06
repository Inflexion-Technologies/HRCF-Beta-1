import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';
import format from 'format-number';


class MainStore extends EventEmitter{
    constructor(){
        super();
        this.balance = 0;
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
        if(data.balance){
            this.balance = data.balance;
            this.emit('dashboard_user_balance');
        }
    }

    doDashboardUserContribution(data){
        if(data.balance){
            this.contribution = data.balance;
            this.emit('dashboard_user_contribution');
        }
    }

    getBalance(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.balance) === '' ? '0.00':formatStyle(this.balance);
    }

    getContribution(){
        const formatStyle = format({integerSeparator:',', round : 2});
        
        return formatStyle(this.contribution) === '' ? '0.00':formatStyle(this.contribution);
    }

    handleActions(action){
        switch(action.type){
            case 'DASHBOARD_USER_BALANCE' : {
                this.doDashboardUserBalance(action.data);
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
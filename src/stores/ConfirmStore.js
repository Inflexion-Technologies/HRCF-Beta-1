import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class ConfirmStore extends EventEmitter{
    constructor(){
        super();
        
    }

    doConfirmTransactionDetailsSuccess(data){
        if(data){
            this.approver = data.approver;
            this.user = data.user;
            this.amount = data.amount;
            this.code = data.code;
            this.account_name = data.account_name;
            this.account_number = data.account_number;
            this.branch = data.branch;
            this.bank = data.bank;
            this.date = data.date;

            this.emit('confirm_transaction_details_success');
        }else{
            this.emit('confirm_transaction_details_failed');
        }
    }

    doConfirmTransactionDetailsFailed(){
        this.emit('confirm_transaction_details_failed');        
    }

    getApprover(){
        return this.approver;
    }

    getRequester(){
        return this.user;
    }

    getAmount(){
        return this.amount;
    }

    getCode(){
        return this.code;
    }

    getAccountName(){
        return this.account_name;
    }

    getAccountNumber(){
        return this.account_number;
    }

    getBranch(){
        return this.branch;
    }

    getBank(){
        return this.bank;
    }

    getDate(){
        return this.date;
    }

    handleActions(action){
        switch(action.type){
            case 'CONFIRM_TRANSACTION_DETAILS_SUCCESS' : {
                this.doConfirmTransactionDetailsSuccess(action.data);
                break;
            }
            case 'CONFIRM_TRANSACTION_DETAILS_FAILED' : {
                this.doConfirmTransactionDetailsFailed();
                break;
            }
            
            default:{}
        }
    }
}

const confirmStore = new ConfirmStore();
dispatcher.register(confirmStore.handleActions.bind(confirmStore));

export default confirmStore;
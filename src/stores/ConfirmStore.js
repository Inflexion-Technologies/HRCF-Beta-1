import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';
import format from 'format-number';


class ConfirmStore extends EventEmitter{
    constructor(){
        super();
        
    }

    doConfirmTransactionDetailsSuccess(data){
        if(data){
            this.approver = data.approver;
            this.user = data.user;
            this.amount = data.amount;
            //this.code = data.code;
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

    doConfirmTransactionApproveFailed(){
        this.emit('confirm_transaction_approve_failed');
    }

    doConfirmTransactionRejectSuccess(){
        this.emit('confirm_transaction_reject_success');
    }

    doConfirmTransactionApproveSuccess(){
        this.emit('confirm_transaction_approve_success')
    }

    getApprover(){
        return this.approver;
    }

    getRequester(){
        return this.user;
    }

    getAmount(){
        console.log('New Balance is '+this.newBalance);
        
        const formatStyle = format({integerSeparator:','});

        return formatStyle(this.amount) === '' ? '0.00':formatStyle(this.amount)+'.00';
    }

    getCode(){
        return '0000';
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
            case 'CONFIRM_TRANSACTION_APPROVE_FAILED' : {
                this.doConfirmTransactionApproveFailed();
                break;
            }
            case 'CONFIRM_TRANSACTION_REJECT_SUCCESS' : {
                this.doConfirmTransactionRejectSuccess();
                break;
            }
            case 'CONFIRM_TRANSACTION_APPROVE_SUCCESS' : {
                this.doConfirmTransactionApproveSuccess();
                break;
            }

            
            
            default:{}
        }
    }
}

const confirmStore = new ConfirmStore();
dispatcher.register(confirmStore.handleActions.bind(confirmStore));

export default confirmStore;
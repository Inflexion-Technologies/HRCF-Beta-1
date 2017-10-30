import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class TransactionStore extends EventEmitter{
    constructor(){
        super();
        this.account_id = 0;
        this.balance = 0;
        this.accounts = [];
        this.selectData = [];
        this.account_id = 0;
        this.amount = 0;
    }

    emitFailedLogin(){
        this.emit('login_failed');
    }

    emitSuccessLogin(data, token){
        
        cookie.save('is_admin', data.is_admin);
        
        this.emit('login_success')
    }

    doTransactionUserBalance(data){
        if(data.balance !== null){
            this.balance = data.balance;
            console.log('Store Balance => '+this.balance);
            this.emit('transaction_user_balance');
        }
    }

    doTransactionUserAccounts(data){
        if(data !== null){
            this.accounts = data;
            this.selectData = [];
            this.selectData.push({value : 0, label : 'Select Account'});
            data.map((account)=>{
                return this.selectData.push({value : account.account_id, label : account.account_name+' - '+account.bank_name});
            });

            this.emit('transaction_user_accounts');
        }
    }

    doTransactionUserConfirmValid(data){

        console.log('Came to confirm STORE');

        if(data.id && (data.msisdn === cookie.load('msisdn'))){
            console.log('was valid');            
            this.emit('transaction_user_confirm_valid');
        }else{
            console.log('was invalid');                        
            this.emit('transaction_user_confirm_invalid');
        }
    }

    doTransactionUserConfirmInValid(){
        this.emit('transaction_user_confirm_invalid');
    }

    doTransactionUserRequest(data){
        if(data.success){
            this.emit('transaction_user_confirm_request');            
        }else{
            this.emit('transaction_user_failed_request');
        }
    }

    setAccount(id){
        this.account_id = id;
    }

    setRemarks(remarks){
        this.remarks = remarks;
    }

    setAmount(amount){
        this.amount = amount;
    }


    getBalance(){
        return parseFloat(this.balance);
    }

    getBank(){
        const account = this.accounts.find((account)=>{
            return parseInt(account.account_id) === parseInt(this.account_id); 
        });

        return account.bank_name.toUpperCase();
    }

    getBranch(){
        const account = this.accounts.find((account)=>{
            return parseInt(account.account_id) === parseInt(this.account_id); 
        });

        return account.branch_name.toUpperCase();
    }

    getAccountNumber(){
        const account = this.accounts.find((account)=>{
            return parseInt(account.account_id) === parseInt(this.account_id); 
        });

        return account.account_number;
    }

    getAccountName(){
        const account = this.accounts.find((account)=>{
            return parseInt(account.account_id) === parseInt(this.account_id); 
        });

        return account.account_name.toUpperCase();
    }

    getAmount(){
        return this.amount;
    }

    getSelectData(){
        return this.selectData;
    }

    getTransactionDetail(){
        return this.account.find((account)=>{
            return this.account_id === account.account_id;
        })
    }

    getAccount(){
        return this.account_id;
    }

    handleActions(action){
        switch(action.type){
            case 'TRANSACTION_USER_BALANCE' : {
                this.doTransactionUserBalance(action.data);
                break;
            }
            case 'TRANSACTION_USER_ACCOUNTS' : {
                this.doTransactionUserAccounts(action.data);
                break;
            }
            case 'TRANSACTION_USER_CONFIRM_VALID' : {
                this.doTransactionUserConfirmValid(action.data);
                break;
            }
            case 'TRANSACTION_USER_CONFIRM_INVALID' : {
                this.doTransactionUserConfirmInValid();
                break;
            }
            case 'TRANSACTION_USER_REQUEST' : {
                this.doTransactionUserRequest(action.data);
                break;
            }
            
           
            
            default:{}
        }
    }
}

const transactionStore = new TransactionStore();
dispatcher.register(transactionStore.handleActions.bind(transactionStore));

export default transactionStore;
import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class TransactionStore extends EventEmitter{
    constructor(){
        super();
        this.balance = 0;
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

    getBalance(){
        return parseFloat(this.balance);
    }

    handleActions(action){
        switch(action.type){
            case 'TRANSACTION_USER_BALANCE' : {
                this.doTransactionUserBalance(action.data);
                break;
            }
           
            default:{}
        }
    }
}

const transactionStore = new TransactionStore();
dispatcher.register(transactionStore.handleActions.bind(transactionStore));

export default transactionStore;
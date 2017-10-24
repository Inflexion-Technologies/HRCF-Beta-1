import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';
import format from 'format-number';

class Withdraw extends EventEmitter{
    constructor(){
        super();
     
        this.amount = 0;
        this.pageNumber = 1;
        this.pageThreshold = 3;
        this.balance = 0;
        this.newBalance = 0;
        this.isNewBalanceSet = false;
    }

    setBankName(){}
    setBankId(){}

    reset(){
        this.amount = 0;
        this.pageNumber = 1;
        this.balance = 0;
        this.newBalance = 0;
    }

    setAmount(amount){
        this.amount = amount;
        this.newBalance = this.balance - this.amount;

        this.emit('withdraw_amount_to_deduct');
    }

    setNewBalance(val){
        if(!this.isNewBalanceSet){
            this.newBalance = parseFloat(val);
            this.isNewBalanceSet = true;            
        }
    }

    getAmount(){
        const formatStyle = format({integerSeparator:','});
        
        return formatStyle(this.amount) === '' ? '0.00':formatStyle(this.amount);
    }

    next(){
        if(this.pageNumber < this.pageThreshold){
            this.pageNumber = this.pageNumber + 1;

            this.emit('withdraw_next');
        }
    }

    back(){
        if(this.pageNumber > 1){
            this.pageNumber = this.pageNumber - 1;

            this.emit('withdraw_back');
        }
    }

    reset(){
        this.pageNumber = 1;
    }

    setBalance(balance){
        this.balance = parseFloat(balance);
        console.log('Balance is => '+this.balance);
        this.emit('withdraw_amount_to_deduct');        
    }

    getNewBalance(){

        console.log('New Balance is '+this.newBalance);

        const formatStyle = format({integerSeparator:','});
        return formatStyle(this.newBalance) === '' ? '0.00':formatStyle(this.newBalance);
    }

    getBalance(){

        console.log('Balance is '+this.newBalance);
        
        const formatStyle = format({integerSeparator:','});
        return formatStyle(this.balance) === '' ? '0.00':formatStyle(this.balance);
    }

    getPageNumber(){
        return this.pageNumber;
    }

    handleActions(action){
        switch(action.type){
            // case 'MAIN_LOAD_OFFICERS' : {
            //     break;
            // } 
            default:{}
        }
    }

}

const withdrawStore = new Withdraw();
dispatcher.register(withdrawStore.handleActions.bind(withdrawStore));

export default withdrawStore;
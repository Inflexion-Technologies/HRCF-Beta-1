import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class UploadStore extends EventEmitter{
    constructor(){
        super();
        

        this.banks = [];
    }
    

    getBanks(){
        return this.banks;
    }

    getUserId(){
        return cookie.load('id');
    }

    getToken(){
        return cookie.load('token');
    }

    pushBanksLoad(banks){
        this.banks = [];

        this.banks.push({value : 0, label : 'Select A Bank'});
        banks.map((bank)=>{
            this.banks.push({value: bank.id, label : bank.name});
        })

        this.emit('upload_banks_loaded');
    }

    handleActions(action){
        switch(action.type){
            case 'UPLOAD_LOAD_BANKS' : {
                this.pushBanksLoad(action.banks);
                break;
            } 
            default:{}
        }
    }

}

const uploadStore = new UploadStore();
dispatcher.register(uploadStore.handleActions.bind(uploadStore));

export default uploadStore;
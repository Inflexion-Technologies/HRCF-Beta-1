import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class MainStore extends EventEmitter{
    constructor(){
        super();
        this.user = {
            
        }
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

    handleActions(action){
        switch(action.type){
            case 'MAIN_LOAD_OFFICERS' : {
                break;
            } 
            default:{}
        }
    }

}

const mainStore = new MainStore();
dispatcher.register(mainStore.handleActions.bind(mainStore));

export default mainStore;
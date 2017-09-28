import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
//import { instanceOf } from 'prop-types';

import cookie from 'react-cookies';


class ThankYouStore extends EventEmitter{

    init (){
        this.user = {};
        this.user.firstname = cookie.load('fname');
        this.user.lastname = cookie.load('lname');
        this.user.msisdn = cookie.load('msisdn');

        this.emit('final');
    }

    getUser(){  
        this.user = {};
        this.user.firstname = cookie.load('fname');
        this.user.lastname = cookie.load('lname');
        this.user.msisdn = cookie.load('msisdn');

        return this.user;
    }


    handleActions(action){
        switch(action.type){
          
        }
    }
}

const thankYouStore = new ThankYouStore();
dispatcher.register(thankYouStore.handleActions.bind(thankYouStore));

export default thankYouStore;
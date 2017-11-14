import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class HistoryStore extends EventEmitter{
    constructor(){
        super();
        this.data = [];
    }

 doHistoryUser(data){

    if(data){
        this.data = data;
        this.emit('history_user');
    }
 }

 getData(){
    return this.data;
 }
 
 handleActions(action){
        switch(action.type){
            case 'HISTORY_USER' : {
                this.doHistoryUser(action.data);
                break;
            }
            
            default:{}
        }
    }
}

const historyStore = new HistoryStore();
dispatcher.register(historyStore.handleActions.bind(historyStore));

export default historyStore;
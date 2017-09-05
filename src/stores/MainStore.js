import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';

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
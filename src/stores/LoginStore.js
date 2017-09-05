import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';


class LoginStore extends EventEmitter{
    constructor(){
        super();
        this.login = {
            username : '',
            password : '',
            uError : false,
            pError : false
        }
    }

    initLogin (username, password){
        this.login.username = username;
        this.login.password = password;

        this.emit('login');
    }

    emitFailedLogin(){
        this.emit('login_failed');
    }

    emitSuccessLogin(data){
        //Set cookie for app
        console.log('DATA ::: '+JSON.stringify(data));

        cookie.save('firstname', data.firstname);
        cookie.save('user_id', data.user_id);
        cookie.save('type', data.type);
        cookie.save('msisdn', data.msisdn);

        this.emit('login_success')
    }

    emitReadyLogin(data){
        if(data.session){
            this.emit('login_ready');
        }
    }

    getLogin(){
        return this.login;
    }

    handleActions(action){
        switch(action.type){
            case 'LOGIN_SUCCESS' : {
                console.log('Logging ...');
                this.emitSuccessLogin(action.user);
                break;
            }
            case 'LOGIN_FAILED' : {
                this.emitFailedLogin();
                break;
            }
            case 'LOGIN_READY' :{
                this.emitReadyLogin(action.data);
                break;
            }
            default:{}
        }
    }
}

const loginStore = new LoginStore();
dispatcher.register(loginStore.handleActions.bind(loginStore));

export default loginStore;
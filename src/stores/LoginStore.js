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

    emitSuccessLogin(data, token){
        //Set cookie for app
        
        cookie.save('firstname', data.firstname);
        cookie.save('lastname', data.lastname);
        cookie.save('id', data.id);
        cookie.save('type', data.type);
        cookie.save('msisdn', data.msisdn);
        cookie.save('email', data.email);
        cookie.save('payment_number', data.payment_number);
        cookie.save('token', token);
        cookie.save('is_admin', data.is_admin);
        
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
                this.emitSuccessLogin(action.user, action.token);
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
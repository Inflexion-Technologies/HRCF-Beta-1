import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class CorporateSignupStore extends EventEmitter{
    constructor(){
        super();
        this.user = {
            firstname : '',
            lastname : '',
            email : '',
            msisdn : '',
            password : '',
            cname : '',
            lname : ''
        }

        this.token = '';
    }

    initUser (user){
        this.user = user;
        this.emit('signup');
    }

    doMsisdnValidate(action){
        if(action.isMsisdnError){
            this.emit('corporate_signup_msisdn_error');
        }else if(action.isMsisdnExist){
            this.emit('corporate_signup_msisdn_exists');
        }else if(!action.isMsisdnExist){
            this.emit('corporate_signup_msisdn_not_exists');
        }
    }

    doEmailValidate(action){
        if(action.isEmailError){
            this.emit('corporate_signup_email_error');
        }else if(action.isEmailExist){
            this.emit('corporate_signup_email_exists');
        }else if(!action.isEmailExist){
            this.emit('corporate_signup_email_not_exists');
        }
    }

    getUser(){
        return this.user;
    }

    getToken(){
        return this.token;
    }

    onSignupComplete(data, token){
        this.user = data;
        this.token = token;

        this.resetCookie();
        
        cookie.save('firstname', this.user.firstname);
        cookie.save('lastname', this.user.lastname);
        cookie.save('email', this.user.email);                
        cookie.save('msisdn', this.user.msisdn);
        cookie.save('token', this.token);
        cookie.save('id', this.user.id);
        cookie.save('type', this.user.type);
        cookie.save('payment_number', this.user.payment_number);
        cookie.save('is_admin', this.user.is_admin);
        cookie.save('is_complete', this.user.is_complete);

        this.emit('corporate_signup_complete');
    }

    resetCookie(){
        cookie.remove('firstname');
        cookie.remove('lastname');
        cookie.remove('email');                
        cookie.remove('msisdn');
        cookie.remove('token');
        cookie.remove('id');
        cookie.remove('type');
        cookie.remove('payment_number');
        cookie.remove('is_admin');
        cookie.remove('is_complete');
    }

    onCorporateExist(action){
        if(action.data){
            this.emit('corporate_signup_corporate_exist');
        }else{
            this.emit('corporate_signup_corporate_not_exist');
        }
    }

    handleActions(action){
        switch(action.type){
            case 'CORPORATE_VALIDATE_MSISDN' : {
                this.doMsisdnValidate(action);
                break;
            } 
            case 'CORPORATE_VALIDATE_EMAIL' : {
                this.doEmailValidate(action);
                break;
            } 
            case 'CORPORATE_SIGNUP_USER' : {
                break;
            } 
            case 'CORPORATE_SIGNUP_COMPLETE' :{
                this.onSignupComplete(action.data, action.token);
                break;
            }
            case 'CORPORATE_EXIST' :{
                this.onCorporateExist(action);
                break;
            }
            default:{}
        }
    }

}

const corporateSignupStore = new CorporateSignupStore();
dispatcher.register(corporateSignupStore.handleActions.bind(corporateSignupStore));

export default corporateSignupStore;
import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';

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

    onSignupComplete(data){
        this.emit('corporate_signup_complete');
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
                this.onSignupComplete(action.data);
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
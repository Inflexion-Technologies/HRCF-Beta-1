import dispatcher from '../dispatcher';
import axios from 'axios';

export function validateMsisdn(user){
    let isMsisdnExist = true;
    let isMsisdnError = false;

    axios.get('/api/v1/utils/is_msisdn_exist/'+user.msisdn)
    .then(res =>{
        if(!res.data.is_exist){
            //Number does not exist
            isMsisdnExist = false;
        }else if(res.data.is_exist){
            //Number exist
            isMsisdnExist = true;
        }else if(res.data.is_exist === undefined){
            //Bad number format
            isMsisdnError = true;
        }

        dispatcher.dispatch({
            type : "VALIDATE_MSISDN",
            msisdn : user.msisdn,
            isMsisdnExist,
            isMsisdnError
        });
    });  
}

export function validateEmail(user){
    let isEmailExist = true;
    let isEmailError = false;

    axios.get('/api/v1/utils/is_email_exist/'+user.email)
    .then(res =>{
        if(!res.data.is_exist){
            //Number does not exist
            isEmailExist = false;
        }else if(res.data.is_exist){
            //Number exist
            isEmailExist = true;
        }else if(res.data.is_exist === undefined){
            //Bad number format
            isEmailError = true;
        }

        dispatcher.dispatch({
            type : "VALIDATE_EMAIL",
            msisdn : user.email,
            isEmailExist,
            isEmailError
        });
    });  
}

export function signupUser(user){
    axios.post('/api/v1/officers/', user)
    .then(res => {
        if(res.data.id){
            dispatcher.dispatch({type : "SIGNUP_COMPLETE", data : res.data});
        }
    });
}

export function isCorporateExist(){
    axios.get().then(res => {
        if(res.data.id){
            dispatcher.dispatch({type : "CORPORATE_EXIST", data : res.is_exist});
        }
    })
}
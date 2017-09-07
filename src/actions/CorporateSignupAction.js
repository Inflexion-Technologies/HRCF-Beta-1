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
            type : "CORPORATE_VALIDATE_MSISDN",
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
            type : "CORPORATE_VALIDATE_EMAIL",
            msisdn : user.email,
            isEmailExist,
            isEmailError
        });
    });  
}

export function corporateSignupUser(user){
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
    if(user){
        console.log('fname : '+user.firstname+', lname : '+user.lastname+', email : '+user.email+', type : '+user.type);
        axios.post('/api/v1/users/', user).then(res => {
            if(res.data.id){
                dispatcher.dispatch({type : "CORPORATE_SIGNUP_COMPLETE", data : res.data});
            }
        });
    }else{
        console.log('user object is empty');
    }
}

export function isCorporateExist(user){
    axios.get('/api/v1/utils/is_corporate_exist/'+user.cname).then(res => {
        if(res.data){
            console.log('corporate is_exist ::: '+res.data.is_exist);
            dispatcher.dispatch({type : "CORPORATE_EXIST", data : res.data.is_exist});
        }
    })
}
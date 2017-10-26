import dispatcher from '../dispatcher';
import axios from 'axios';
import cookie from 'react-cookies'

export function getUnits(){
    const token = cookie.load('token');
    axios.get('/api/v1/misc/units', {params : {token}})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "TRANSACTION_UNITS",
                data: res.data
            });
        }
    });
}

export function getBalance(){
    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.get('/api/v1/transactions/balance/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "TRANSACTION_USER_BALANCE",
                data: res.data
            });
        }
    });
}

export function getAccount(){
    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.get('/api/v1/accounts/user/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "TRANSACTION_USER_ACCOUNTS",
                data: res.data
            });
        }
    });
}

export function placeRequest(detail){
    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.post('/api/v1/transactions/request/'+id, {token,detail})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "TRANSACTION_USER_REQUEST",
                data: res.data
            });
        }
    });
}

export function isPasswordValid(password){
    const username = cookie.load('msisdn');

    axios.get('/api/utils/login/', {params :{username,password}})
    .then((res)=>{
        if(res.data.user !== null){
            dispatcher.dispatch({
                type : "TRANSACTION_USER_CONFIRM_VALID",
                data: res.data.user
            });
        }else{
            dispatcher.dispatch({
                type : "TRANSACTION_USER_CONFIRM_INVALID",
                data: null
            });
        }
    }).catch(()=>{
        dispatcher.dispatch({
            type : "TRANSACTION_USER_CONFIRM_INVALID",
            data: null
        });
    });
}
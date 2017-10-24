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
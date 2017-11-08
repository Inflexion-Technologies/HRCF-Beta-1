import dispatcher from '../dispatcher';
import axios from 'axios';
import cookie from 'react-cookies'

export function loadTotalBalance(){

    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.get('/api/v1/transactions/balance/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "DASHBOARD_USER_BALANCE",
                data: res.data
            });
        }
    });
}

// export function loadTotalInterest(){
    
//         const id = cookie.load('id');
//         const token = cookie.load('token');
    
//         axios.get('/api/v1/transactions/interest/user/'+id, {params :{token}})
//         .then((res)=>{
//             if(res.data !== null){
//                 dispatcher.dispatch({
//                     type : "DASHBOARD_USER_BALANCE",
//                     data: res.data
//                 });
//             }
//         });
// }

export function loadTotalContribution(){
        
const id = cookie.load('id');
const token = cookie.load('token');

    axios.get('/api/v1/transactions/contributions/user/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "DASHBOARD_USER_CONTRIBUTION",
                data: res.data
            });
        }
    });
}

export function loadTotalInterest(){
    
const id = cookie.load('id');
const token = cookie.load('token');

    axios.get('/api/v1/transactions/interest/user/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "DASHBOARD_USER_INTEREST",
                data: res.data
            });
        }
    });
}
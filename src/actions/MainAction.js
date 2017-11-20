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

export function requestReset(email){

    axios.post('/api/utils/forgot/'+email)
    .then((res)=>{
        if(res.data.success === true){
            dispatcher.dispatch({
                type : "FORGOT_REQUEST_SUCCESS",
                data: true
            });
        }
    }).catch((error)=>{
        dispatcher.dispatch({
            type : "FORGOT_REQUEST_FAILED"
        });
    })
}

export function resetPassword(uuid, password){
    
        axios.get('/api/utils/reset/', {params:{password,uuid}})
        .then((res)=>{
            if(res.data.success === true){
                dispatcher.dispatch({
                    type : "RESET_REQUEST_SUCCESS",
                    data: true
                });
            }
        }).catch((error)=>{
            dispatcher.dispatch({
                type : "RESET_REQUEST_FAILED"
            });
        })
}

export function loadFundAllocationPie(){
        axios.get('/api/utils/fund_allocation/pie')
        .then((res)=>{
            if(res.data){
                dispatcher.dispatch({
                    type : "PIE_DATA_SUCCESS",
                    data: res.data
                });
            }
        }).catch((error)=>{
            dispatcher.dispatch({
                type : "PIE_DATA_FAILED"
            });
        })
}

export function loadNAV(){
    axios.get('/api/utils/nav_performance')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "NAV_DATA_SUCCESS",
                data: res.data
            });
        }
    }).catch((error)=>{
        dispatcher.dispatch({
            type : "NAV_DATA_FAILED"
        });
    })
}

export function loadInterestPerformance(){
    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.get('/api/v1/transactions/interest/performance/'+id, {params : {id,token}})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "INTEREST_DATA_SUCCESS",
                data: res.data
            });
        }
    }).catch((error)=>{
        dispatcher.dispatch({
            type : "INTEREST_DATA_FAILED"
        });
    })
}
import dispatcher from '../dispatcher';
import axios from 'axios';

export function confirmTransactionDetails(key){
    axios.get('/api/utils/transaction/details/'+key)
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_DETAILS_SUCCESS",
                data : res.data
            });
        }else{
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_DETAILS_FAILED"
            });
        }
    })
    .catch((error)=>{
        dispatcher.dispatch({
            type : "CONFIRM_TRANSACTION_DETAILS_FAILED"
        });
    })
}

export function approveTransaction(key, uuid){
    axios.post('/api/utils/transaction/approve/', {key, uuid})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_APPROVE_SUCCESS",
                data : res.data
            });
        }else{
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_APPROVE_FAILED"
            });
        }
    })
    .catch((error)=>{
        dispatcher.dispatch({
            type : "CONFIRM_TRANSACTION_APPROVE_FAILED"
        });
    })
}

export function rejectTransaction(uuid){
    axios.post('/api/utils/transaction/reject/', {uuid})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_REJECT_SUCCESS",
                data : res.data
            });
        }else{
            dispatcher.dispatch({
                type : "CONFIRM_TRANSACTION_REJECT_FAILED"
            });
        }
    })
    .catch((error)=>{
        dispatcher.dispatch({
            type : "CONFIRM_TRANSACTION_REJECT_FAILED"
        });
    })
}
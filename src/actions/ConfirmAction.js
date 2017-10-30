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
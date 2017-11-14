import dispatcher from '../dispatcher';
import axios from 'axios';
import cookie from 'react-cookies'

export function loadTransactionHistory(){

    const id = cookie.load('id');
    const token = cookie.load('token');

    axios.get('/api/v1/transactions/history/user/'+id, {params :{token}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "HISTORY_USER",
                data: res.data
            });
        }
    });
}

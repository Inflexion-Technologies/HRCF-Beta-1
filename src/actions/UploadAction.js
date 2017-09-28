import dispatcher from '../dispatcher';
import axios from 'axios';

export function loadBanks(){

    axios.get('/api/utils/banks')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "UPLOAD_LOAD_BANKS",
                banks: res.data
            });
        }
    });

    // axios.get('/api/utils/banks')
    // .then((res)=>{
    //     if(res.data){
    //         dispatcher.dispatch({
    //             type : "UPLOAD_LOAD_BANKS",
    //             banks: res.data
    //         });
    //     }
    // });
}
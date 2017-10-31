import dispatcher from '../dispatcher';
import axios from 'axios';

export function loadICBanks(){

    axios.get('/api/utils/icbanks')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "UPLOAD_LOAD_BANKS",
                banks: res.data
            });
        }
    });
}
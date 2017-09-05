import dispatcher from '../dispatcher';
import axios from 'axios';

export function loadOfficers(type){

    axios.get('/api/v1/officers/', {params :{type}})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "MAIN_LOAD_OFFICERS",
                user: res.data
            });
        }
    });
}
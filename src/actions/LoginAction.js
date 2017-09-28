import dispatcher from '../dispatcher';
import axios from 'axios';

export function registerSession(){
    axios.get('/api/sessions/register')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "LOGIN_READY",
                data: res.data
            });
        }
    });
}

export function login(username, password){
    axios.get('/api/utils/login/', {params :{username, password}})
    .then((res)=>{
        if(res.data !== null){
            dispatcher.dispatch({
                type : "LOGIN_SUCCESS",
                user: res.data.user,
                token: res.data.token
            });
        }else{
            dispatcher.dispatch({
                type : "LOGIN_FAILED"
            });
        }
    });
}
import dispatcher from '../dispatcher';
import axios from 'axios';
import cookie from 'react-cookies';

export function loadOverlayBanks(){
    axios.get('/api/utils/banks')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "OVERLAY_BANKS_LOADED",
                data: res.data
            });
        }
    });
}

export function loadOverlayBranches(bank_id){
    axios.get('/api/utils/branches/'+bank_id)
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "OVERLAY_BRANCH_LOADED",
                data: res.data
            });
        }
    });
}

export function loadIDTypes(){
    axios.get('/api/utils/idtypes/')
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "OVERLAY_ID_TYPES",
                data: res.data
            });
        }
    });
}

export function updateDetails(details){
    const data = {...details, token : cookie.load('token')};
    console.log('Sending data ....'+JSON.stringify(data));
    axios.put('/api/v1/misc/user/'+cookie.load('id')+'/complete_registration', data)
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "OVERLAY_UPDATE_DETAILS",
                data: res.data
            });
        }
    });
}

export function getUserCompany(){
    const token = cookie.load('token');
    axios.get('/api/v1/misc/user/'+cookie.load('id')+'/company', {params : {token}})
    .then((res)=>{
        if(res.data){
            dispatcher.dispatch({
                type : "OVERLAY_COMPANY_DETAILS",
                data: res.data
            });
        }
    });
}
import dispatcher from '../dispatcher';
import axios from 'axios';

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
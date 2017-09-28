import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class OverlayStore extends EventEmitter{
    constructor(){
        super();
        this.banks = [];
        this.branches = [];
        this.idTypes = [];
    }

   doBanksLoading(data){
    if(data){
        this.banks = [];
        data.map((bank)=>{
            this.banks.push({value : bank.id, label : bank.name});
        });

        this.emit('overlay_banks_loaded');
    }
   }

   doBranchLoading(data){
       if(data){
        this.branches = [];
        data.map((branch)=>{
            this.branches.push({value: branch.id, label : branch.name});
        })

        this.emit('overlay_branches_loaded');
       }
   }

   doIDTypesLoading(data){
       if(data){
           this.idTypes = [];
           data.map((idType)=>{
               this.idTypes.push({value: idType.id, label: idType.name});
           })

           this.emit('overlay_idtypes_loaded');
       }
   }

    getBanks(){
        return this.banks;
    }

    getBranches(){
        return this.branches;
    }

    getIDTypes(){
        return this.idTypes;
    }

    handleActions(action){
        switch(action.type){
            case 'OVERLAY_BANKS_LOADED' : {
                this.doBanksLoading(action.data);
                break;
            } 
            case 'OVERLAY_BRANCH_LOADED' : {
                this.doBranchLoading(action.data);
                break;
            } 
            case 'OVERLAY_ID_TYPES' : {
                this.doIDTypesLoading(action.data);
                break;
            } 
            
            default:{}
        }
    }

}

const overlayStore = new OverlayStore();
dispatcher.register(overlayStore.handleActions.bind(overlayStore));

export default overlayStore;
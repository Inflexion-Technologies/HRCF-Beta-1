import {EventEmitter} from 'events';
import dispatcher from '../dispatcher';
import cookie from 'react-cookies';

class OverlayStore extends EventEmitter{
    constructor(){
        super();
        this.banks = [];
        this.branches = [];
        this.idTypes = [];
        this.user = {};
        this.page = 1;
        this.user.primaryBank = {};
        this.user.secondaryBank = {};
        this.user.primaryApprover = {};
        this.user.secondaryApprover = {};
        this.user.idInfo = {};
        this.user.companyInfo = {};  
        this.company = '';      
    }

   doBanksLoading(data){
    if(data){
        this.banks = [];
        this.banks.push({value : 0, label : 'Select A Bank'});
        data.map((bank)=>{
            this.banks.push({value : bank.id, label : bank.name});
        });

        this.emit('overlay_banks_loaded');
    }
   }

   doBranchLoading(data){
       if(data){
        this.branches = [];
        this.branches.push({value: 0, label : 'Select Branch'});
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

   doUpdateDetails(data){
       if(data.is_complete){
           console.log('Details Complete !!!!');

           cookie.save('is_complete', 'Y');           
           this.emit('overlay_update_successful');
       }
   }

   doCompanyDetails(data){
       if(data){
           this.company = data.name;

           this.emit('overlay_company_detail');
       }
   }

   getPaymentNumber(){
       return cookie.load('payment_number');
   }

   getFirstName(){
       return cookie.load('firstname');
   }

   setOverlayType(val){
       switch(val){
           case 'I' : {
            this.pageThreshold = 4;
            break;
           }

           case 'C' : {
            this.pageThreshold = 7;
            break;
           }

           default : {

           }
       }
   }

   next(){
    if(this.page >= 1 && this.page <= this.pageThreshold){
        this.page = this.page + 1;
        this.emit('overlay_page_changed');
    }
   }

   confirm(){

   }

   setPrimaryBank(detail){
    this.user.primaryBank = {};
    this.user.primaryBank = detail;
   }

   setSecondaryBank(detail){
    this.user.secondaryBank = {};
    this.user.secondaryBank = detail;
   }

   setPrimaryApprover(approver){
    this.user.primaryApprover = {};
    this.user.primaryApprover = approver;
   }

   setSecondaryApprover(approver){
    this.user.secondaryApprover = {};
    this.user.secondaryApprover = approver;
   }

   setIDInfo(detail){
    this.user.idInfo = {};
    this.user.idInfo = detail;
   }

   setCompanyInfo(detail){
    this.user.companyInfo = {};
    this.user.companyInfo = detail;
   }

   getAllInfo(){
    let data = {};

    data.primary_bank_name = this.user.primaryBank.bank_name;
    data.primary_bank_id = this.user.primaryBank.bank_id;
    data.primary_branch_name = this.user.primaryBank.branch_name;
    data.primary_branch_id = this.user.primaryBank.branch_id;
    data.primary_account_number = this.user.primaryBank.account_number;
    data.primary_account_name = this.user.primaryBank.account_name;

    if(this.pageThreshold === 4){
        data.primary_approver_first = cookie.load('firstname');
        data.primary_approver_last = cookie.load('lastname');               
        data.primary_approver_msisdn = cookie.load('msisdn');
        data.primary_approver_email = cookie.load('email');
    }else if(this.pageThreshold === 7){
        data.primary_approver_first = this.user.primaryApprover.approver === undefined ? '' : this.user.primaryApprover.approver.split(' ')[0];
        data.primary_approver_last = this.user.primaryApprover.approver === undefined ? '' : this.user.primaryApprover.approver.split(' ')[1];               
        data.primary_approver_msisdn = this.user.primaryApprover.approver_msisdn;
        data.primary_approver_email = this.user.primaryApprover.approver_email;
    }
    
    data.reg_number = this.user.companyInfo.reg_number === undefined ? 0 : this.user.companyInfo.reg_number;
    data.id_type = this.user.idInfo.id_type;
    data.id_type_id = this.user.idInfo.id_type_id;
    data.id_number = this.user.idInfo.id_number;
    data.id_filename = this.user.idInfo.filename;

    if(!(this.user.secondaryBank.bank_id === undefined || this.user.secondaryBank.bank_id === null)){
        data.secondary_bank_name = this.user.secondaryBank.bank_name;
        data.secondary_bank_id = this.user.secondaryBank.bank_id;
        data.secondary_branch_name = this.user.secondaryBank.branch_name;
        data.secondary_branch_id = this.user.secondaryBank.branch_id;
        data.secondary_account_name = this.user.secondaryBank.account_name;
        data.secondary_account_number = this.user.secondaryBank.account_number;
    }

    if(!(this.user.secondaryApprover.approver_msisdn === undefined || this.user.secondaryApprover.approver_msisdn === null)){
        data.secondary_approver_first = this.user.secondaryApprover.approver.split(' ')[0];
        data.secondary_approver_last = this.user.secondaryApprover.approver.split(' ')[1];               
        data.secondary_approver_msisdn = this.user.secondaryApprover.approver_msisdn;
        data.secondary_approver_email = this.user.secondaryApprover.approver_email;
    }

    return data;
   }

   getPage(){
    return this.page;
   }

   back(){
    if(this.page >= 2){
        this.page = this.page - 1;
        this.emit('overlay_page_changed');        
    }
   }

   addUserBank(bank){
    this.userBanks.push(bank);
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

   getCompany(){
    return this.company;
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
            case 'OVERLAY_UPDATE_DETAILS' : {
                this.doUpdateDetails(action.data);
                break;
            } 
            case 'OVERLAY_COMPANY_DETAILS' : {
                this.doCompanyDetails(action.data);
                break;
            } 

            
            
            default:{}
        }
    }

}

const overlayStore = new OverlayStore();
dispatcher.register(overlayStore.handleActions.bind(overlayStore));

export default overlayStore;
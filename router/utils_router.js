import express from 'express';
import request from 'request';
import dateformat from 'dateformat';
import * as d from '../config';
// import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';

import util_ from 'util';
import jwt from 'jsonwebtoken';

//import express_formidable from 'express-formidable';


export default class UtilsRoutes{ 

constructor(UsersModel, TracksModel, CompanyModel, BankModel, BranchModel, IDModel, RequestModel, AccountModel, ApproveModel, ICBankModel, PayOutModel, WithdrawModel, TransactionModel, ForgotModel, FundAllocationStoreModel, FundAllocationCollectionModel, NAVStoreModel){
    this.app = this;
    this.UsersModel = UsersModel;
    this.TracksModel = TracksModel;    
    this.CompanyModel = CompanyModel;
    this.BankModel = BankModel;
    this.BranchModel = BranchModel;
    this.IDModel = IDModel;
    this.RequestModel = RequestModel;
    this.AccountModel = AccountModel;
    this.ApproveModel = ApproveModel;
    this.ICBankModel = ICBankModel;
    this.PayOutModel = PayOutModel;
    this.WithdrawModel = WithdrawModel;
    this.TransactionModel = TransactionModel;
    this.ForgotModel = ForgotModel;
    this.FundAllocationStoreModel = FundAllocationStoreModel;
    this.FundAllocationCollectionModel = FundAllocationCollectionModel;
    this.NAVStoreModel = NAVStoreModel;
}

getGeneratedId(count, type){
    const now = new Date();
    const year = dateformat(now, "yy");
    const month = dateformat(now, "mm");

    //Bubble the zeros
    let id = '';
    switch((count+'').length){
        case 1 :{
            id = '0000'+count;
            break;
        };
        case 2 :{
            id = '000'+count;
            break;
        }
        case 3 :{
            id = '00'+count;
            break;
        }
        case 4 :{
            id = '0'+count;
            break;
        }
        case 5 :{
            id = ''+count;
        }

        default : 
            id = count;
    }

    console.log(''+type+year+id+month);
    return ''+type+year+id+month;
}

updateIndividualPaymentNumber(user, res){
    const app = this;
    const expressApp = express();
    const utils = require('../services/utils');    
    
    expressApp.set('token', d.config.secret);
    
    if(user.type === 'I'){
        app.TracksModel.findById(1).then(track => {
           let newCount = (track.count)+1;
           let paymentId = app.getGeneratedId(newCount, '01');

           //Update count
           app.TracksModel.update({count : newCount}, {where : {id : 1}}).then(track=>{

                //Update user
                if(track){
                    app.UsersModel.update({payment_number : paymentId, company_id : 1}, {where : {id : user.id}}).then(tmpuser=>{
                        if(tmpuser){
                            app.UsersModel.findOne({where : {id : user.id}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status']}).then(user =>{
                                if(user){
                                    const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                    res.status(200).json({
                                        user : user,
                                        success: true,
                                        message: 'Successful',
                                        token: token
                                      });
                                    utils.sendWelcomeMail(user.email, user.firstname);
                                }                                    
                            })
                        }else{
                            res.status(400).send('Could not update');
                        }
                    });
                }else{

                    console.log('Something happened !');
                    res.status(400).send('Something went wrong');
                }
            });
        })
   }
}

updateCompanyPaymentNumber(user, res){
    const app = this;

    const expressApp = express();
    
    expressApp.set('token', d.config.secret);
    
    if(user.type === 'C'){
        app.TracksModel.findById(2).then(track => {
            let newCount = (track.count)+1;
            let paymentId = app.getGeneratedId(newCount, '00');

            //Update count
            app.TracksModel.update({count : newCount}, {where : {id : 2}}).then(track=>{
  
                if(track){

                    //Save company
                    app.CompanyModel.create({name : user.cname.toLowerCase(), location : user.lname}).then(company=>{
                        if(company){

                            //Update user
                            app.UsersModel.update({payment_number : paymentId, company_id: company.id}, {where : {id : user.id}}).then(tmpuser=>{
                                if(tmpuser){
                                    app.UsersModel.findOne({where : {id : user.id}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status']}).then(user =>{
                                        if(user){
                                            const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                            res.status(200).json({
                                                user : user,
                                                success: true,
                                                message: 'Successful',
                                                token: token
                                              });
                                        }
                                    })
                                }else{
                                    res.status(400).send('Could not update');
                                }
                            });
                        }
                    });

                }else{

                    console.log('Something happened !');
                    res.status(400).send('Something went wrong');
                }
            });
        })
   }
}

routes(){
    const app = this;

    const utilsRouter = express.Router();
    const expressApp = express();
    
    utilsRouter.use(bodyParser.json({limit: '50mb'}));
    utilsRouter.use(bodyParser.urlencoded({limit: '50mb', extended: true}));   

    //utilsRouter.use(express_formidable());
    

    const utils = require('../services/utils');
    //let upload  = multer({storage: app.storage}).any();

    expressApp.set('token', d.config.secret);
    

    utilsRouter.route('/login')
    .get((req, res)=>{

        if(req.query && req.query.username.trim().length > 0 && req.query.password.trim().length > 0){
            if(utils.isValidEmail(req.query.username.trim())){
                app.UsersModel.findOne({where : {email : req.query.username, password : utils.getHash(req.query.password)}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'is_admin','status']}).then(user => {
                    if(user){
                        const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                        res.status(200).json({
                            success: true,
                            message: 'Successful',
                            token: token,
                            user : user
                          });
                    }else{
                        res.status(400).json('something wrong happened');
                    }
                });
            }else if(utils.isValidMSISDN(req.query.username.trim())){
                app.UsersModel.findOne({where : {msisdn : req.query.username, password : utils.getHash(req.query.password)}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'is_admin','status']}).then(user => {
                    if(user){
                        const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                        res.status(200).json({
                            success: true,
                            message: 'Successful',
                            token: token,
                            user : user
                          });
                    }else{
                        res.status(400).send('something wrong happened');
                    }
                });
            }
        }else{
            res.status(400).send('Data not received');                                                                    
        }
    });

    utilsRouter.route('/is_email_exist/:email')
        .get((req, res)=>{ 
            if(utils.isValidEmail(req.params.email.trim())){
                app.UsersModel.findOne({where : {email : req.params.email}}).then(user => {
                    if(user){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(400).send('Wrong EMAIL format');
            }
        });   


    utilsRouter.route('/icbanks')
        .get((req, res)=>{ 
            app.ICBankModel.findAll({where : {status : 'A'}}).then((banks)=>{
                res.status(200).json(banks);
            })
        }); 
        
    utilsRouter.route('/idtypes')
        .get((req, res)=>{ 
            app.IDModel.findAll({where : {status : 'A'}}).then((ids)=>{
                res.status(200).json(ids);
            })
        });

    utilsRouter.route('/branches/:bank_id')
        .get((req, res)=>{ 
            app.BranchModel.findAll({where : {status : 'A', bank_id: req.params.bank_id}, order:[['name', 'ASC']]}).then((branches)=>{
                res.status(200).json(branches);
            })
        });  

    utilsRouter.route('/is_msisdn_exist/:msisdn')
        .get((req, res)=>{  
            if(utils.isValidMSISDN(req.params.msisdn.trim())){
                app.UsersModel.findOne({where : {msisdn : req.params.msisdn}}).then(user => {
                    if(user){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(200).json('Wrong MSISN format');
            }
        }); 

    utilsRouter.route('/is_corporate_exist/:corporate')
        .get((req, res)=>{  
            if(req.params.corporate.toLowerCase().trim()){
                app.CompanyModel.findOne({where : {name : req.params.corporate}}).then(company => {
                    if(company){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(200).json('Wrong corporate name');
            }
        });

    utilsRouter.route('/banks')
        .get((req, res)=>{  
            app.BankModel.findAll({where : {status : 'A'}, order : [['name', 'ASC']]}).then(banks => {
                if(banks){
                    res.status(200).json(banks);                    
                }else{
                    res.status(200).send('No Banks Available');                                        
                }
            });
        });

    utilsRouter.route('/fund_allocation/pie')
        .get((req, res)=>{  
            app.FundAllocationStoreModel.max('id', {where : {status : 'A'}})
            .then((store)=>{

                //console.log('S T O R E => '+store);
                if(store){
                    app.FundAllocationCollectionModel.findAll({where : {fund_allocation_store_id : store}})
                    .then((collections)=>{

                        let pie_data = [];
                        collections.map((collection)=>{
                            pie_data.push({name: collection.asset_class, y: collection.aum_percent});
                        });

                        res.status(200).json(pie_data);                        
                    })
                }else{
                    res.status(400).json({success : false});
                }
            })
        });

    utilsRouter.route('/nav_performance')
        .get((req, res)=>{  
            app.NAVStoreModel.findAll({where :{status : 'A'}})
            .then((navs)=>{
                if(navs){
                    const dateFormat = require('dateformat');   
                    const _ = require('lodash');
                    
                    let nav_data = [];
                    let onlyDates = [];
                    let nav_data_final = [];
                    
                    //Group all by date and id
                    
                    navs.map((nav)=>{
                        const unit = nav.per_change;
                        const date = dateFormat(new Date(nav.created_at), 'dd mmm');

                        onlyDates.push(date);
                        nav_data.push({date, unit});
                    });


                    let uniqDates = _.uniq(onlyDates);

                    uniqDates.map((u_date)=>{
                        const nd = _.find(nav_data, {date : u_date});
                        nav_data_final.push(nd);
                    });

                    console.log('N A V    D A T A   = > '+nav_data_final);

                    res.status(200).json(nav_data_final);
                }else{
                    res.status(400).json({success : false});
                }
            })
    });

    utilsRouter.route('/reset')
        .get((req, res)=>{ 
            const password = req.query.password;
            const uuid = req.query.uuid;

            console.log('PASSWORD => '+password);

            app.ForgotModel.findOne({where : {uuid, status : 'P'}})
            .then((forgot)=>{
                if(forgot){
                    app.UsersModel.findOne({where : {id : forgot.user_id, status : 'A'}})
                    .then((user)=>{
                        if(user){
                            user.update({password})
                            .then((user)=>{
                                res.status(200).json({success : true});
                            })
                        }else{
                            res.status(400).json({success : false});
                        }
                    });
                    forgot.update({status : 'D'});
                }else{
                    res.status(400).json({success : false});
                }
            });
        });

    utilsRouter.route('/forgot/:email')
        .post((req, res)=>{  
            
            if(utils.isValidEmail(req.params.email)){
                app.UsersModel.findOne({where : {email : req.params.email,
                                                status : 'A'}})
                .then((user)=>{
                    if(user){
                        
                        app.ForgotModel.create({user_id:user.id})
                        .then((forgot)=>{
                            if(forgot){
                                //Push email notification
                                utils.sendResetMail(user.email, user.firstname, forgot.uuid);
                                res.status(200).json({success : true});
                            }
                        })
                    }else{
                        res.status(400).json({success : false});
                    }
                })
            }else{
                res.status(400).json({success : false});
            }
        });

    utilsRouter.route('/adduser')
        .post((req, res)=>{
        
          if(Object.keys(req.body) != 0){
                req.body.is_admin = 'N';

                app.UsersModel.create(req.body).then((user)=>{
                    if(user && req.body.type === 'C'){
                        user.lname = req.body.lname;
                        user.cname = req.body.cname;

                        app.updateCompanyPaymentNumber(user, res);
                    }else if(user && req.body.type === 'I'){
                        app.updateIndividualPaymentNumber(user, res);
                    }
                });
          }else if(Object.keys(req.query) != 0){
                req.query.is_admin = 'N';    
                app.UsersModel.create(req.query).then((user)=>{
                    if(user && req.query.type === 'C'){
                        user.lname = req.query.lname;
                        user.cname = req.query.cname;

                        app.updateCompanyPaymentNumber(user, res);
                    }else if(user && req.body.type === 'I'){
                        app.updateIndividualPaymentNumber(user, res);
                    }
                }).catch((error)=>{
                    if(error)
                        res.status(400).send('Could not save data');
                });
          }else{
              console.log('Passed NONE !!!');
              res.status(400).send('JSON format required');
          }
    }); 

    utilsRouter.use('/adduploader', (req, res, next)=>{
        console.log();
        const app = express();
            //JSON Web Token Secret
            app.set('token', d.config.secret);
    
                // check header or url parameters or post parameters for token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            
            // decode token
            if(token) {
        
                // verifies secret and checks exp
                jwt.verify(token, app.get('token'), function(err, decoded) {      
                    if (err) {
                        return res.json({ success: false, message: 'Failed to authenticate token.' });    
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;    
                        next();
                    }
                });
        
            }else{
        
                // if there is no token
                // return an error
                return res.status(403).send({ 
                    success: false, 
                    message: 'No token provided.' 
                });
        
            }
    })
        

    utilsRouter.route('/adduser')
    .post((req, res)=>{
    
      if(Object.keys(req.body) != 0){
            app.UsersModel.create(req.body).then((user)=>{
                if(user && req.body.type === 'C'){
                    user.lname = req.body.lname;
                    user.cname = req.body.cname;

                    app.updateCompanyPaymentNumber(user, res);
                }else if(user && req.body.type === 'I'){
                    app.updateIndividualPaymentNumber(user, res);
                }
            });
      }else if(Object.keys(req.params) != 0){
            app.UsersModel.create(req.params).then((user)=>{
                if(user && req.params.type === 'C'){
                    user.lname = req.params.lname;
                    user.cname = req.params.cname;

                    app.updateCompanyPaymentNumber(user, res);
                }else if(user && req.body.type === 'I'){
                    app.updateIndividualPaymentNumber(user, res);
                }
            }).catch((error)=>{
                if(error)
                    res.status(400).send('Could not save data');
            });
      }else{
          console.log('Passed NONE !!!');
      }
    }); 

    utilsRouter.route('/statement/upload')
        .post((req, res)=> {
            utils.saveFile(req, res);
        })

    utilsRouter.route('/national_id/upload')
        .post((req, res)=> {
            utils.saveID(req, res);
        })

    utilsRouter.route('/transaction/reject')
        .post((req, res)=> {
            const uuid = req.body.uuid;

            app.RequestModel.findOne({where : {uuid, status: 'P'}})
            .then((request)=>{
                if(request){
                    request.update({status : 'R'})
                    .then((request)=>{
                        app.RequestModel.findAll({where : {transaction_code:request.transaction_code}})
                        .then((requests)=>{
                            if(requests){
                                requests.map((request, i)=>{
                                    request.update({status: 'R'});
                                    if(i === (requests.length-1)){
                                        app.UsersModel.findOne({where : {id : request.user_id, status : 'A'}})
                                        .then((user)=>{
                                            user.increment({'available_balance' : parseFloat(request.amount)})
                                            .then((user)=>{
                                                res.status(200).json({success: true});
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    })
                }else{
                    res.status(400).json({success : false});
                }

            })
        })

    utilsRouter.route('/transaction/approve')
        .post((req, res)=> {
            app.RequestModel.findOne({where : {uuid : req.body.uuid, transaction_code: req.body.key, status : 'P'}})
            .then((request)=>{
                if(request){
                    app.UsersModel.findOne({where : {id : request.user_id, status : 'A'}})
                    .then((user)=>{
                        user.decrement({'actual_balance' : request.amount})
                        .then((user)=>{
                            app.WithdrawModel.create({amount : request.amount, user_id : user.id, account_id: request.account_id});
                            app.TransactionModel.create({type : 'W', amount: request.amount, user_id:user.id,narration: 'Withdraw'});
                        })                       
                    });

                    request.update({status : 'A'})
                    .then((request)=>{
                         app.RequestModel.findAll({where : {transaction_code: request.transaction_code, status: 'P'}})
                        .then((requests)=>{
                            if(requests === null || requests.length === 0){
                                //all approval done
                                 app.PayOutModel.create({user_id: request.user_id,
                                                        amount: request.amount,
                                                        account_id: request.account_id,
                                                        request_date: request.created_at,
                                                        status : 'P'})
                                        .then((payout)=>{
                                            if(payout){

                                                app.UsersModel.findOne({where :{id : payout.user_id, status : 'A'}})
                                                .then((user)=>{
                                                    if(user){
                                                        app.AccountModel.findOne({where :{id : payout.account_id, status : 'A'}, include : [{model : app.BranchModel, include: [{model : app.BankModel}] }] })
                                                        .then((account)=>{
                                                            utils.sendDebitMail(user.email, user.firstname, payout.amount, payout.request_date, account.bank_branch.bank.name, account.name, account.account_number);                                                            
                                                            res.status(200).json({success : true});                                                            
                                                        })
                                                    }else{
                                                        res.status(200).json({success : true});                                                           
                                                    }
                                                })
                                                
                                            }                                 
                                        })
                            }else{
                                res.status(200).json({success : true});
                            }
                        })                        
                    })
                }else{
                    res.status(400).json({success : false});
                }
            })
        })

    utilsRouter.route('/transaction/details/:transaction_key')
        .get((req, res)=> {
            const key = req.params.transaction_key;

            app.RequestModel.findOne({where : {uuid : key, status : 'P'}, include : [app.ApproveModel, app.UsersModel, {model : app.AccountModel, include : [{model : app.BranchModel, include : [{model : app.BankModel}]}]}]})
            .then((request)=>{
                if(request){
                    let data = {};
                    data.approver = request.approver.firstname;
                    data.amount = request.amount;
                    //data.code = request.transaction_code;
                    data.date = request.created_at;

                    data.user = request.user.firstname;
                    data.account_name = request.account.name;
                    data.account_number = request.account.account_number;
                    data.branch = request.account.bank_branch.name;
                    data.bank = request.account.bank_branch.bank.name;

                    res.status(200).json(data);
                }else{
                    res.status(400).send('No Data');
                }
            })
        })

        return utilsRouter;
    }
}
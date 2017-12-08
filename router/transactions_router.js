import express from 'express';
import request from 'request';
import gen from 'shortid';
import _ from 'lodash'
    
export default class TransactionsRoutes{

    constructor(TransactionModel, UserModel, RequestModel, ApproveModel, CreditModel){
        this.TransactionModel = TransactionModel;
        this.UserModel = UserModel;
        this.RequestModel = RequestModel;
        this.ApproveModel = ApproveModel;
        this.CreditModel = CreditModel;
    }

    routes(){
        const app = this;
        const transactionsRouter = express.Router();

        //const json2xls = require('json2xls');

        //express.use(json2xls.middleware)

        transactionsRouter.route('/')
            .get((req, res)=>{  
                app.TransactionModel.findAll({where: {status:'A'},  include: [{model : app.UserModel, attributes:['firstname', 'lastname', 'payment_number', 'email', 'msisdn']}] }).then(transactions => {
                    res.status(200).json(transactions);
                })
            });   

        transactionsRouter.route('/:id')
            .get((req, res)=>{
                app.TransactionModel.findOne({where: {id : req.params.id, status:'A'},  include: [{model : app.UserModel, attributes:['firstname', 'lastname', 'payment_number', 'email', 'msisdn']}] }).then(transaction => {
                    res.status(200).json(transaction);
                })
            }); 

        transactionsRouter.route('/user_id/:user_id')
            .get((req, res)=>{
               app.TransactionModel.findOne({ where : {user_id : req.params.user_id},  include: [{model : app.UserModel, attributes:['firstname', 'lastname', 'payment_number', 'email', 'msisdn']}] }).then(transaction =>{
                   res.status(200).json(transaction);
               })
            }); 

        transactionsRouter.route('/balance/:user_id')
            .get((req, res)=>{
               app.UserModel.findOne({ where : {id : req.params.user_id, status : 'A'}, attributes : ['id','available_balance', 'actual_balance'] }).then(user =>{
                    if(user){
                        res.status(200).json(user);
                    }else{
                        res.status(403).send('Nothing Found');
                    } 
               })
            });

        transactionsRouter.route('/contributions/user/:user_id')
            .get((req, res)=>{
            
               //Contributions First
               app.TransactionModel.sum('amount', {where :{type : 'C', status : 'A', user_id : req.params.user_id}})
               .then((credit)=>{
                   if(credit){
                        res.status(200).json({contribution : credit});
                    }else{
                        res.status(200).json({contribution : 0});
                    }
               })

            });

        transactionsRouter.route('/interest/user/:id')
            .get((req, res)=>{
                app.TransactionModel.sum('amount', {where : {user_id : req.params.id, type : 'I', status : 'A'}})
                .then((interest)=>{
                    if(interest){
                        res.status(200).json({interest})
                    }else{
                        res.status(200).json({interest : 0});
                    }
                });
            });

        transactionsRouter.route('/history/user/:id')
            .get((req, res)=>{

                //Find pending transactions
                app.RequestModel.findAll({where : {user_id : req.params.id, status : 'P'}, order:[['id', 'DESC']]})
                .then((requests)=>{
                    if(requests){
                        //Got some pending requests
                        app.TransactionModel.findAll({where : {user_id :req.params.id}, order:[['id', 'DESC']] })
                        .then((transactions)=>{
                            if(transactions){
                                //Prepare a collection and send back
                                let collection = [];

                                const utils = require('../services/utils');    
                                const uniqRequest = utils.getUniqCollection(requests, 'transaction_code');

                                uniqRequest.map((request)=>{
                                    return collection.push({date : request.created_at, 
                                                    transaction: 'Withdraw',
                                                    amount : request.amount,
                                                    status : 'Pending'});
                                })

                                transactions.map((transaction)=>{
                                    collection.push({date : transaction.created_at,
                                                    transaction: transaction.narration,
                                                    amount : transaction.amount,
                                                    status : 'Successful'});
                                })

                                res.status(200).json(collection);
                            }
                        })
                    }else{
                        //Got no pending requests
                        app.TransactionModel.findAll({where : {user_id : req.params.id}, order:[['id', 'DESC']]})
                        .then((transactions)=>{
                            res.status(200).json(transactions);
                        })
                    }
                })
            });

        transactionsRouter.route('/')
            .post((req, res)=>{
                if(req.body){
                    app.TransactionModel.create(req.body).then((transaction)=>{
                        res.status(200).json(transaction);                                
                    })
                }else{
                    res.status(200).send('Data not saved!');
                }
            }); 

        transactionsRouter.route('/reports/:id')
            .get((req, res)=>{
                
            }); 

        transactionsRouter.route('/reports/withdrawal/:id')
            .get((req, res)=>{
                app.TransactionModel.findAll({where : {type : 'W', status : 'A'}})
                .then((transactions)=>{
                    if(transactions){
                        res.status(200).xls(transactions);
                    }
                })
            }); 

        transactionsRouter.route('/reports/credit/:id')
            .get((req, res)=>{
                app.TransactionModel.findAll({where : {type : 'C', status : 'A'}})
                .then((transactions)=>{
                    if(transactions){
                        res.status(200).xls(transactions);                        
                    }
                })
            }); 

        transactionsRouter.route('/reports/interest/:id')
            .get((req, res)=>{
                res.status(200).xls(transactions);                
            }); 

        transactionsRouter.route('/interest/performance/:user_id')
            .get((req, res)=>{
                app.TransactionModel.findAll({where : {user_id : req.params.user_id, type : 'I', status : 'A'}})
                .then((interests)=>{
                    if(interests){
                        const dateFormat = require('dateformat');

                        let interest_data = [];
                        
                        interests.map((interest)=>{
                            const amount = interest.amount;
                            const date = dateFormat(new Date(interest.created_at), 'dd mmm');

                            interest_data.push({date, amount});
                        })

                        res.status(200).json(interest_data);
                    }else{
                        res.status(400).json({success : false});
                    }
                })
            }); 

        transactionsRouter.route('/request/:user_id')
            .post((req, res)=>{
                if(req.body){
                    const user_id = req.params.user_id;
                    const amount = parseFloat(req.body.detail.amount);
                    const account_id = req.body.detail.account_id;
                    const password = req.body.detail.password;
                    const transaction_code = gen.generate(); 
                    const utils = require('../services/utils');
                    

                    console.log('Amount => '+amount+', account => '+account_id);
                    
                    //Grab all approvers

                    //Verify User
                    app.UserModel.findOne({where : {id : user_id, password : utils.getHash(password)}}).then(user => {
                        if(user){
                            if(user.available_balance > amount){
                                user.decrement({'available_balance' : amount}).then((user)=>{
                                    console.log('Available balance Debited!');
                                    app.placeRequest(res, user_id, amount, account_id, transaction_code);
                                }); 
                            }else{
                                res.status(400).json({success : false, code : 0});
                            }
                        }else{
                            res.status(200).json({success : false});
                        }
                    });

                }else{
                    res.status(200).send('Data not saved!');
                }
            });

        transactionsRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return transactionsRouter;
    }

    placeRequest(res, user_id, amount, account_id, transaction_code){
        const app = this;

        app.ApproveModel.findAll({where : {user_id, status : 'A'}})
        .then((approvers)=>{
            let counter = 0;
            approvers.map((approver)=>{
                const approver_id = approver.id;
                const approve_name = approver.firstname;
                const email = approver.email;
                

                return app.RequestModel.create({transaction_code, 
                                        user_id,
                                        amount,
                                        account_id,
                                        approver_id
                                    })
                                    .then((request)=>{
                                        const utils = require('../services/utils');
                                        utils.sendApprovalEmail(approve_name, email, request.uuid, transaction_code);
                                        counter = counter + 1;
                                        if(counter === (approvers.length)){
                                            res.status(200).json({success : true})
                                        }
                                    })
              })
        })
    }

};
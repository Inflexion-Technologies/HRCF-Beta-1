import express from 'express';
import request from 'request';
import gen from 'shortid';
    
export default class TransactionsRoutes{

    constructor(TransactionModel, UserModel, RequestModel, ApproveModel){
        this.TransactionModel = TransactionModel;
        this.UserModel = UserModel;
        this.RequestModel = RequestModel;
        this.ApproveModel = ApproveModel;
    }

    routes(){
        const app = this;
        const transactionsRouter = express.Router();

        transactionsRouter.route('/')
            .get((req, res)=>{  
                app.TransactionModel.findAll({where: {status:'A'}, limit: 150,  include: [app.UserModel] }).then(transactions => {
                    res.status(200).json(transactions);
                })
            });   

        transactionsRouter.route('/:id')
            .get((req, res)=>{
                app.TransactionModel.findById(req.params.id).then(transaction => {
                    res.status(200).json(transaction);
                })
            }); 

        transactionsRouter.route('/user_id/:user_id')
            .get((req, res)=>{
               app.TransactionModel.findOne({ where : {user_id : req.params.user_id},  include: [app.UserModel] }).then(transaction =>{
                   res.status(200).json(transaction);
               })
            }); 

        transactionsRouter.route('/balance/:user_id')
            .get((req, res)=>{
               app.UserModel.findOne({ where : {id : req.params.user_id, status : 'A'}, attributes : ['id','balance'] }).then(user =>{
                    if(user){
                        res.status(200).json(user);
                    }else{
                        res.status(403).send('Nothing Found');
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

        transactionsRouter.route('/request/:user_id')
            .post((req, res)=>{
                if(req.body){
                    const user_id = req.params.user_id;
                    const amount = req.body.detail.amount;
                    const account_id = req.body.detail.account_id;
                    const password = req.body.detail.password;
                    const transaction_code = gen.generate(); 
                    const utils = require('../services/utils');
                    

                    console.log('Amount => '+amount+', account => '+account_id);
                    
                    //Grab all approvers

                    //Verify User
                    app.UserModel.findOne({where : {id : user_id, password : utils.getHash(password)}}).then(user => {
                        if(user){
                            user.decrement({'balance' : parseFloat(amount)}).then((user)=>{
                                app.placeRequest(res, user_id, user.email, amount, account_id, transaction_code);
                            }); 
                        }else{
                            res.status(400).json({success : false});
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

    placeRequest(res, user_id, email, amount, account_id, transaction_code){
        const app = this;

        app.ApproveModel.findAll({where : {user_id, status : 'A'}})
        .then((approvers)=>{
            return approvers.map((approver)=>{
                const approver_id = approver.id;
                let counter = 0;

                return app.RequestModel.create({transaction_code, 
                                        user_id,
                                        amount,
                                        account_id,
                                        approver_id
                                    })
                                    .then((request)=>{
                                        if(request){
                                            counter = counter + 1;
                                        }

                                        if(counter === (approvers.length)){
                                            const utils = require('../services/utils');
                                            utils.sendEmail(email, 'Confirm', request.uuid);
                                            res.status(200).json({success : true})
                                        }
                                    })
              })
        })
    }

};
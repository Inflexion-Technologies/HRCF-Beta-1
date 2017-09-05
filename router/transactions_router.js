import express from 'express';
import request from 'request';
    
export default class TransactionsRoutes{

    constructor(TransactionModel, UserModel){
        this.TransactionModel = TransactionModel;
        this.UserModel = UserModel;
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

        transactionsRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return transactionsRouter;
    }

};
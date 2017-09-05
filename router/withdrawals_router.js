import express from 'express';
import request from 'request';
    
export default class WithdrawalsRoutes{

    constructor(WithdrawalModel, UserModel){
        this.WithdrawalModel = WithdrawalModel;
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const withdrawalsRouter = express.Router();

        withdrawalsRouter.route('/')
            .get((req, res)=>{  
                app.WithdrawalModel.findAll({where: {status:'A'}, limit: 150,  include: [app.UserModel] }).then(withdrawals => {
                    res.status(200).json(withdrawals);
                })
            });   

        withdrawalsRouter.route('/:id')
            .get((req, res)=>{
                app.WithdrawalModel.findById(req.params.id).then(withdrawal => {
                    res.status(200).json(withdrawal);
                })
            }); 

        withdrawalsRouter.route('/user_id/:user_id')
            .get((req, res)=>{
               app.WithdrawalModel.findOne({ where : {user_id : req.params.user_id},  include: [app.UserModel] }).then(withdrawal =>{
                   res.status(200).json(withdrawal);
               })
            }); 

        withdrawalsRouter.route('/')
            .post((req, res)=>{
                if(req.body){
                    app.WithdrawalModel.create(req.body).then((withdrawal)=>{
                        res.status(200).json(withdrawal);                                
                    })
                }else{
                    res.status(200).send('Data not saved!');
                }
            }); 

        withdrawalsRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return withdrawalsRouter;
    }

};
import express from 'express';
import request from 'request';
    
export default class CreditsRoutes{

    constructor(CreditModel, BankModel, UserModel){
        this.CreditModel = CreditModel;
        this.BankModel = BankModel;
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const creditsRouter = express.Router();

        creditsRouter.route('/')
            .get((req, res)=>{  
                app.CreditModel.findAll({where: {status:'A'}, limit: 150,  include: [app.UserModel, app.BankModel] }).then(credits => {
                    res.status(200).json(credits);
                })
            });   

        creditsRouter.route('/:id')
            .get((req, res)=>{
                app.CreditModel.findById(req.params.id).then(credit => {
                    res.status(200).json(credit);
                })
            }); 

        creditsRouter.route('/user_id/:user_id')
            .get((req, res)=>{
               app.CreditModel.findOne({ where : {user_id : req.params.user_id},  include: [app.UserModel, app.BankModel] }).then(credit =>{
                   res.status(200).json(credit);
               })
            }); 

        creditsRouter.route('/')
            .post((req, res)=>{
                if(req.body){
                    app.CreditModel.create(req.body).then((credit)=>{
                        res.status(200).json(credit);                                
                    })
                }else{
                    res.status(200).send('Data not saved!');
                }
            }); 

        creditsRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return withdrawalsRouter;
    }

};
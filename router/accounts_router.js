import express from 'express';
import request from 'request';
    
export default class AccountsRoutes{

    constructor(AccountModel, BranchModel, BankModel, UserModel){
        this.AccountModel = AccountModel;
        this.BranchModel = BranchModel;
        this.BankModel = BankModel;
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const accountsRouter = express.Router();

        accountsRouter.route('/')
            .get((req, res)=>{  
                app.AccountModel.findAll({where: {status:'A'}, limit: 150,  include: [app.UserModel] }).then(accounts => {
                    res.status(200).json(accounts);
                })
            });   

        accountsRouter.route('/user/:id')
            .get((req, res)=>{
                let container = [];
                app.AccountModel.findAll({where : {user_id : req.params.id}, all:true, include : [{model: app.BranchModel, include : [{model : app.BankModel}]}]})
                .then(accounts => {
                    if(accounts){
                        let container = [];
                        accounts.map((account, i)=>{
                            const account_id = account.id;
                            const user_id = account.user_id;
                            const account_name = account.name;
                            const account_number = account.account_number;
                            const branch_name = account.bank_branch.name;
                            const bank_name = account.bank_branch.bank.name;

                            container.push({account_id, user_id, account_name, account_number, branch_name, bank_name});
                            if(i === (accounts.length-1)){
                                res.status(200).json(container);
                            }
                        })
                    }else{
                        res.status(200).json(null);                        
                    }
                })
            }); 

        accountsRouter.route('/balance/:user_id')
            .get((req, res)=>{
               app.UserModel.findOne({ where : {id : req.params.user_id, status : 'A'}, attributes : ['id','balance'] }).then(user =>{
                    if(user){
                        res.status(200).json(user);
                    }else{
                        res.status(403).send('Nothing Found');
                    } 
               })
            });

        accountsRouter.route('/')
            .post((req, res)=>{
                if(req.body){
                    app.AccountModel.create(req.body).then((account)=>{
                        res.status(200).json(account);                                
                    })
                }else{
                    res.status(200).send('Data not saved!');
                }
            }); 
            

        accountsRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return accountsRouter;
    }

};
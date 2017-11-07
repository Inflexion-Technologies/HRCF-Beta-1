import express from 'express';

export default class BankStatementRoutes{

    constructor(BankStatements, ICBanks, UserModel){
        this.BankStatements = BankStatements;
        this.ICBanks = ICBanks;
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const bankStatementRouter = express.Router();
        const utils = require('../services/utils');    

        //Middleware to check all request comes from an admin
        bankStatementRouter.use('/*', (req,res,next)=>{
            if(req.query.username === undefined){
                req.query.username = '';
            }
    
            if(req.query.password === undefined){
                req.query.password = '';
            }

            if(req.query.username.trim().length > 6 && req.query.password.trim().length > 5){
                if(utils.isValidEmail(req.query.username.trim())){
                    app.UserModel.findOne({where : {email : req.query.username, password : utils.getHash(req.query.password), is_admin : 'Y'}}).then((user)=>{
                        if(user){
                            next();
                        }else{
                            res.status(400).send('user does not exist');
                        }
                    })
                }else if(utils.isValidMSISDN(req.query.username.trim())){
                    app.UserModel.findOne({where : {msisdn : req.query.username, password : utils.getHash(req.query.password), is_admin : 'Y'}}).then((user)=>{
                        if(user){
                            next();
                        }else{
                            res.status(400).send('user does not exist');
                        }
                    })
                }else{
                    res.status(404).json({success : false});
                }
                
            }else{
                res.status(400).send('Username and Password required');
            }
        });

        bankStatementRouter.route('/')
            .get((req, res)=>{  
                app.BankStatements.findAll({ where: {status: 'A'}, include : [app.ICBanks]}).then(statements => {
                    res.status(200).json(statements);
                })
            });   

        bankStatementRouter.route('/:id')
            .get((req, res)=>{
                app.BankStatements.findById(req.params.id).then(statement => {
                    res.status(200).json(statement);
                })
            }); 

        bankStatementRouter.route('/today')
            .get((req, res)=>{
                const today = new Date();
                app.BankStatements.findAll({where : {created_at : today}}).then(statement => {
                    res.status(200).json(statement);
                })
            }); 

        bankStatementRouter.route('/date/:date')
            .get((req, res)=>{
                const date = new Date(req.params.date);



                //const date = new Date(Date.UTC(d.getYear(), d.getMonth(), d.getDate()));
                console.log('Date => '+date);
                app.BankStatements.findAll({where : {created_at : date}}).then(statement => {
                    res.status(200).json(statement);
                })
            }); 

        return bankStatementRouter;
    }

};
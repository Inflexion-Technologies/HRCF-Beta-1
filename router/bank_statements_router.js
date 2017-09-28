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
        bankStatementRouter.use('/', (req,res,next)=>{
            if(req.query.username.trim().length > 6 && req.query.password.trim().length > 5){
                app.UserModel.findOne({where : {username : req.query.username, password : utils.getHash(req.query.password), is_admin : 'Y'}}).then((user)=>{
                    if(user){
                        next();
                    }else{
                        res.status(400).send('user does not exist');
                    }
                })
            }else{
                res.status(400).send('Username and Password required');
            }
        });

        bankStatementRouter.route('/')
            .get((req, res)=>{  
                app.BankStatements.findAll({ where: {status: 'A'}, limit: 150, include : [app.ICBanks]}).then(statements => {
                    res.status(200).json(statements);
                })
            });   

        bankStatementRouter.route('/:id')
            .get((req, res)=>{
                app.BankStatements.findById(req.params.id).then(statement => {
                    res.status(200).json(statement);
                })
            }); 

        bankStatementRouter.use('/today', (req,res,next)=>{
                if(req.query.username.trim().length > 6 && req.query.password.trim().length > 5){
                    app.UserModel.findOne({where : {username : req.query.username, password : utils.getHash(req.query.password), is_admin : 'Y'}}).then((user)=>{
                        if(user){
                            next();
                        }else{
                            res.status(400).send('user does not exist');
                        }
                    })
                }else{
                    res.status(400).send('Username and Password required');
                }
        });

        bankStatementRouter.route('/today')
            .get((req, res)=>{
                const today = new Date().getDate();
                app.BankStatements.findAll({where : {created_at : today}}).then(statement => {
                    res.status(200).json(statement);
                })
            }); 

        // bankStatementRouter.route('/')
        // .post((req, res)=>{
        //     if(req.body){
        //         app.BankStatements.create(req.body).then((statement)=>{
        //             res.status(200).json(statement);                                
        //         })
        //     }else{
        //         res.status(200).send('Data not saved!');
        //     }
        // }); 

        // bankStatementRouter.route('/:id')
        //     .delete((req, res)=>{
        //         app.BankStatements.update({status : 'D'}, {where : {id : req.params.id}}).then((statement)=>{
        //             res.status(200).json(statement);
        //         });
        //     });

        return bankStatementRouter;
    }

};
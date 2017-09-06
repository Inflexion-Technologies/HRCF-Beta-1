import express from 'express';
import request from 'request';

export default class UtilsRoutes{ 

constructor(UsersModel){
    this.UsersModel = UsersModel;
}

getUserDetails(res, user){
    res.status(200).json(user);
}

routes(){
    const app = this;
    const utilsRouter = express.Router();
    const utils = require('../services/utils');

    utilsRouter.route('/login')
    .get((req, res)=>{

        if(req.query && req.query.username.trim().length > 0 && req.query.password.trim().length > 0){
            if(utils.isValidEmail(req.query.username.trim())){
                app.UsersModel.findOne({where : {email : req.query.username, password : utils.getHash(req.query.password)}}).then(user => {
                    if(user){
                        this.getUserDetails(res, user); 
                        
                        //Set sessions
                        req.session.user = user;  
                    }else{
                        res.status(200).json(user);
                    }
                    this.getUserDetails(res, user);                                                  
                });
            }else if(utils.isValidMSISDN(req.query.username.trim())){
                app.UsersModel.findOne({where : {msisdn : req.query.username, password : utils.getHash(req.query.password)}}).then(user => {
                    if(user){
                        this.getUserDetails(res, user); 

                        //Set sessions
                        req.session.user = user;                                                              
                    }else{
                        res.status(200).json(user);
                    }
                });
            }
        }else{
            res.status(200).send('Data not received');                                                                    
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
                res.status(200).send('Wrong EMAIL format');
            }
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

        return utilsRouter;
    }
}
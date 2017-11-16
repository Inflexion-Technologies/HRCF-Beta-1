import express from 'express';
import jwt from 'jsonwebtoken';
import * as d from '../config';

export default class AuthRoutes{

    constructor(UserModel){
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const authRouter = express.Router();
        const utils = require('../services/utils');
        const expressApp = express();

        expressApp.set('token', d.config.secret);
        
        authRouter.route('/')
            .get((req, res)=>{  
                if(req.query){
                    if(utils.isValidEmail(req.query.username.trim())){
                        app.UserModel.findOne({ where: {email: req.query.username,  password : utils.getHash(req.query.password)}}).then(user => {
                            if(user){
                                const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                  });
                            }else{
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        })
                    }else if(utils.isValidMSISDN(req.query.username.trim())){
                        app.UserModel.findOne({ where: {email: req.query.username,  password : utils.getHash(req.query.password)}}).then(user => {
                            if(user){
                                const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                  });
                            }else{
                                res.status(400).send('Unsuccessful Authentication');
                            }


                        })
                    }
                }
            });    

        authRouter.route('/')
            .post((req, res)=>{

                console.log('express value ::: '+expressApp.get('token'));

                if(req.body){
                    if(utils.isValidEmail(req.body.username.trim())){
                        app.UserModel.findOne({ where: {email: req.body.username,  password : utils.getHash(req.body.password)}}).then(user => {
                            if(user){
                                const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                  });
                            }else{
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        })
                    }else if(utils.isValidMSISDN(req.body.username.trim())){
                        app.UserModel.findOne({ where: {email: req.body.username,  password : utils.getHash(req.body.password)}}).then(user => {
                            if(user){
                                const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1d'});
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                  });
                            }else{
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        })
                    }
                }
            }); 

        return authRouter;
    }

};
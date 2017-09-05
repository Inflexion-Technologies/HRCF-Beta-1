import express from 'express';
import * as d from '../config';


export default class SessionRoutes{ 

    constructor(UsersModel){
        this.UsersModel = UsersModel;
    }

    routes(){
        const app = this;
        const sessionsRouter = express.Router();
        const utils = require('../services/utils');    

        sessionsRouter.route('/register')
            .get((req, res)=>{  
                const username = d.config.sessions_username;
                const password = d.config.sessions_password;

                app.UsersModel.findOne({where : {msisdn : '0244000000', password : utils.getHash('000000')}}).then(user => {
                    if(user){
                        req.session.user = user;
                        res.status(200).json({session: true});
                    }else{
                        res.status(404).json('sessions error');                    
                    }
                });
            });   

        sessionsRouter.route('/:id')
            .get((req, res)=>{
                res.status(200).send('not implemented');
        });  

        return sessionsRouter;
    }
}
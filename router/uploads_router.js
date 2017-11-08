import express from 'express';

export default class UploadRoutes{

constructor(BankStatement){
    this.BankStatement = BankStatement;
}

routes(){
    const app = this;
    const uploadRouter = express.Router();

    uploadRouter.route('/')
        .get((req, res)=>{  
            app.Banks.findAll({ where: {status: 'A'}, limit: 150}).then(banks => {
                res.status(200).json(banks);
            })
        });   

    uploadRouter.route('/:id')
        .get((req, res)=>{
            app.Banks.findById(req.params.id).then(bank => {
                res.status(200).json(bank);
            })
        });  

    uploadRouter.route('/')
        .post((req, res)=>{

        console.log('bank_id => '+req.body.bank_id);

        const utils = require('../services/utils');
        utils.saveFile(req, res);
        }); 

     uploadRouter.route('/:id')
        .delete((req, res)=>{
            app.Banks.update({status : 'D'}, {where : {id : req.params.id}}).then((bank)=>{
                res.status(200).json(bank);
            });
        });

    return uploadRouter;
    }

}
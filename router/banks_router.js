import express from 'express';
    
export default class BanksRoutes{

    constructor(Banks){
        this.Banks = Banks;
    }

    routes(){
        const app = this;
        const banksRouter = express.Router();

        banksRouter.route('/')
            .get((req, res)=>{  
                app.Banks.findAll({ where: {status: 'A'}, limit: 150}).then(banks => {
                    res.status(200).json(banks);
                })
            });   

        banksRouter.route('/:id')
            .get((req, res)=>{
                app.Banks.findById(req.params.id).then(bank => {
                    res.status(200).json(bank);
                })
            });  

        banksRouter.route('/')
        .post((req, res)=>{
            if(req.body){
                app.Banks.create(req.body).then((bank)=>{
                    res.status(200).json(bank);                                
                })
            }else{
                res.status(200).send('Data not saved!');
            }
        }); 

        banksRouter.route('/:id')
            .delete((req, res)=>{
                app.Banks.update({status : 'D'}, {where : {id : req.params.id}}).then((bank)=>{
                    res.status(200).json(bank);
                });
            });

        return banksRouter;
    }

};
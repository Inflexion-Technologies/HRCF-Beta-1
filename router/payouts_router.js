import express from 'express';

export default class PayoutRoutes{

    constructor(Payouts){
        this.Payouts = Payouts;
    }

    routes(){
        const app = this;
        const payoutsRouter = express.Router();

        payoutsRouter.route('/')
            .get((req, res)=>{  
                app.Payouts.findAll().then(payouts => {
                    res.status(200).json(payouts);
                })
            });

        payoutsRouter.route('/pending')
            .get((req, res)=>{  
                app.Payouts.findAll({where : {status : 'P'}}).then(payouts => {
                    res.status(200).json(payouts);
                })
            });   

        payoutsRouter.route('/paid')
            .get((req, res)=>{  
                app.Payouts.findAll({where : {status : 'A'}}).then(payouts => {
                    res.status(200).json(payouts);
                })
            });  

        payoutsRouter.route('/:id')
            .get((req, res)=>{
                app.Payouts.findById(req.params.id).then(payout => {
                    res.status(200).json(payout);
                })
            });  

        payoutsRouter.route('/xls')
            .get((req, res)=>{  
                app.Payouts.findAll().then(payouts => {
                    res.status(200).xls(payouts);
                })
            });

        payoutsRouter.route('/pending/xls')
            .get((req, res)=>{  
                app.Payouts.findAll({where : {status : 'P'}}).then(payouts => {
                    res.status(200).xls(payouts);
                })
            });   

        payoutsRouter.route('/paid/xls')
            .get((req, res)=>{  
                app.Payouts.findAll({where : {status : 'A'}}).then(payouts => {
                    res.status(200).xls(payouts);
                })
            });  

        payoutsRouter.route('/:id/xls')
            .get((req, res)=>{
                app.Payouts.findById(req.params.id).then(payout => {
                    res.status(200).xls(payout);
                })
            }); 


        return payoutsRouter;
    }
};
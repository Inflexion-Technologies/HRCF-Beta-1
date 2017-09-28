import express from 'express';
import request from 'request';
    
export default class CompanysRoutes{

    constructor(CompanyModel, UserModel){
        this.CompanyModel = CompanyModel;
        this.UserModel = UserModel;
    }

    routes(){
        const app = this;
        const companysRouter = express.Router();

        companysRouter.route('/')
            .get((req, res)=>{  
                app.CompanyModel.findAll({where: {status:'A'}, limit: 150,  include: [app.UserModel] }).then(company => {
                    res.status(200).json(company);
                })
            });   

        companysRouter.route('/:id')
            .get((req, res)=>{
                app.CompanyModel.findById(req.params.id).then(company => {
                    res.status(200).json(company);
                })
            }); 

        companysRouter.route('/user_id/:user_id')
            .get((req, res)=>{
               app.CompanyModel.findOne({ where : {user_id : req.params.user_id},  include: [app.UserModel] }).then(company =>{
                   res.status(200).json(company);
               })
            }); 

        // companysRouter.route('/')
        //     .post((req, res)=>{
        //         if(req.body){
        //             app.CompanyModel.create(req.body).then((company)=>{
        //                 res.status(200).json(company);                                
        //             })
        //         }else{
        //             res.status(200).send('Data not saved!');
        //         }
        //     }); 

        // companysRouter.route('/:id')
        //     .delete((req, res)=>{
                
        //     });

        return companysRouter;
    }

};
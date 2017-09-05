import express from 'express';

export default class ApproveRoutes{ 

    constructor(ApproveModel){
        this.ApproveModel = ApproveModel;
    }

    routes(){
        const app = this;
        const approversRouter = express.Router();

        approversRouter.route('/')
            .get((req, res)=>{  
                app.ApproveModel.findAll().then(approvers => {
                    res.status(200).json(approvers);
                });
            });   

        approversRouter.route('/:id')
            .get((req, res)=>{
                // User.findById(req.params.id).then(user => {
                //     res.status(200).json(user);
                // })
            }); 

        approversRouter.route('/email/:email')
            .get((req, res)=>{
            // User.findOne({ where : {email : req.params.email}}).then(user => {
            //  res.status(200).json(user);
            // })
            }); 

        approversRouter.route('/')
            .post((req, res)=>{
                
                if(Object.keys(req.body) != 0){
                        app.ApproveModel.create(req.body).then((approver)=>{
                            res.status(200).json(approver);
                        });
                }else if(Object.keys(req.params) != 0){
                        app.ApproveModel.create(req.params).then((approver)=>{
                            res.status(200).json(approver);
                        });
                }
            }); 

        approversRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return approversRouter;
    }
}
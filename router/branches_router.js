import express from 'express';

export default class BranchesRoutes{

constructor(BranchModel){
    this.BranchModel = BranchModel;
}

routes(){
    const app = this;
    const branchesRouter = express.Router();

    branchesRouter.route('/')
        .get((req, res)=>{  
            app.BranchModel.findAll({ where: {status: 'A'}}).then(branches => {
                res.status(200).json(branches);
            })
        });   

    branchesRouter.route('/:id')
        .get((req, res)=>{
            app.BranchModel.findById(req.params.id).then(branch => {
                res.status(200).json(branch);
            })
        });  

    branchesRouter.route('/')
    .post((req, res)=>{
        if(req.body){
            app.BranchModel.create(req.body).then((branch)=>{
                res.status(200).json(branch);                                
            })
        }else{
            res.status(200).send('Data not saved!');
        }
    }); 

    branchesRouter.route('/:id')
        .delete((req, res)=>{
            app.BranchModel.update({status : 'D'}, {where : {id : req.params.id}}).then((branch)=>{
                res.status(200).json(branch);
            });
        });

    return branchesRouter;
}

};
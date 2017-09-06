import express from 'express';
    
export default class UserRoutes{ 

    constructor(UsersModel){
        this.UsersModel = UsersModel;
    }

    routes(){
        const app = this;
        const usersRouter = express.Router();

        usersRouter.route('/')
            .get((req, res)=>{  
                app.UsersModel.findAll({where : {status : 'A'}}).then(users => {
                    res.status(200).json(users);
                });
            });   

        usersRouter.route('/:id')
            .get((req, res)=>{
                User.findOne({where : {id : req.params.id, status : 'A'}}).then(user => {
                    res.status(200).json(user);
                })
            }); 

        usersRouter.route('/email/:email')
            .get((req, res)=>{
               User.findOne({ where : {email : req.params.email, status : 'A'}}).then(user => {
                res.status(200).json(user);
               })
            }); 

        usersRouter.route('/')
            .post((req, res)=>{
                
              if(Object.keys(req.body) != 0){
                    app.UsersModel.create(req.body).then((user)=>{
                        res.status(200).json(user);
                    });
              }else if(Object.keys(req.params) != 0){
                    app.UsersModel.create(req.params).then((user)=>{
                        res.status(200).json(user);
                    });
              }
            }); 

        usersRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return usersRouter;
    }
}
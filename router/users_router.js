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
                app.UsersModel.findAll().then(users => {
                    res.status(200).json('success');
                });
            });   

        usersRouter.route('/:id')
            .get((req, res)=>{
                // User.findById(req.params.id).then(user => {
                //     res.status(200).json(user);
                // })
            }); 

        usersRouter.route('/email/:email')
            .get((req, res)=>{
               // User.findOne({ where : {email : req.params.email}}).then(user => {
               //  res.status(200).json(user);
               // })
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
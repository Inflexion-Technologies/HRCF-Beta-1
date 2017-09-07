import express from 'express';
import dateformat from 'dateformat';
    
export default class UserRoutes{ 

    constructor(UsersModel, TracksModel, CompanyModel){
        this.UsersModel = UsersModel;
        this.TracksModel = TracksModel;
        this.CompanyModel = CompanyModel;
    }

    getGeneratedId(count, type){
        const now = new Date();
        const year = dateformat(now, "yy");
        const month = dateformat(now, "mm");

        //Bubble the zeros
        let id = '';
        switch((count+'').length){
            case 1 :{
                id = '0000'+count;
                break;
            };
            case 2 :{
                id = '000'+count;
                break;
            }
            case 3 :{
                id = '00'+count;
                break;
            }
            case 4 :{
                id = '0'+count;
                break;
            }
            case 5 :{
                id = ''+count;
            }

            default : 
                id = count;
        }

        console.log('H'+type+year+id+month);
        return 'H'+type+year+id+month;
    }

    updateIndividualPaymentNumber(user, res){
        const app = this;
        
        if(user.type === 'I'){
            app.TracksModel.findById(1).then(track => {
               let newCount = (track.count)+1;
               let paymentId = app.getGeneratedId(newCount, '01');

               //Update count
               app.TracksModel.update({count : newCount}, {where : {id : 1}}).then(track=>{

                    //Update user
                    if(track){
                        app.UsersModel.update({payment_number : paymentId, company_id : 1}, {where : {id : user.id}}).then(user=>{
                            if(user){
                                app.UsersModel.findOne().then(user =>{
                                    res.status(200).json(user);                                    
                                })
                            }else{
                                res.status(400).send('Could not update');
                            }
                        });
                    }else{

                        console.log('Something happened !');
                        res.status(400).send('Something went wrong');
                    }
                });
            })
       }
    }

    updateCompanyPaymentNumber(user, res){
        const app = this;
        
        if(user.type === 'C'){
            app.TracksModel.findById(2).then(track => {
                let newCount = (track.count)+1;
                let paymentId = app.getGeneratedId(newCount, '00');

                //Update count
                app.TracksModel.update({count : newCount}, {where : {id : 2}}).then(track=>{
      
                    if(track){

                        //Save company
                        app.CompanyModel.create({name : user.cname, location : user.lname}).then(company=>{
                            if(company){

                                //Update user
                                app.UsersModel.update({payment_number : paymentId, company_id: company.id}, {where : {id : user.id}}).then(user=>{
                                    if(user){
                                        app.UsersModel.findOne().then(user =>{
                                            res.status(200).json(user);                                    
                                        })
                                    }else{
                                        res.status(400).send('Could not update');
                                    }
                                });
                            }
                        });

                    }else{

                        console.log('Something happened !');
                        res.status(400).send('Something went wrong');
                    }
                });
            })
       }
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
                        if(user && req.body.type === 'C'){
                            user.lname = req.body.lname;
                            user.cname = req.body.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        }else if(user && req.body.type === 'I'){
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    });
              }else if(Object.keys(req.params) != 0){
                    app.UsersModel.create(req.params).then((user)=>{
                        if(user && req.params.type === 'C'){
                            user.lname = req.params.lname;
                            user.cname = req.params.cname;

                            app.updatePaymentNumber(user, res);
                        }
                    }).catch((error)=>{
                        if(error)
                            res.status(400).send('Could not save data');
                    });
              }else{
                  console.log('Passed NONE !!!');
              }
            }); 

        usersRouter.route('/:id')
            .delete((req, res)=>{
                
            });

        return usersRouter;
    }
}
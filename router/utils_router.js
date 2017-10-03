import express from 'express';
import request from 'request';
import dateformat from 'dateformat';
import * as d from '../config';
// import multer from 'multer';
import path from 'path';
import bodyParser from 'body-parser';

import util_ from 'util';
import jwt from 'jsonwebtoken';

//import express_formidable from 'express-formidable';


export default class UtilsRoutes{ 

constructor(UsersModel, TracksModel, CompanyModel, BankModel, BranchModel, IDModel){
    this.app = this;
    this.UsersModel = UsersModel;
    this.TracksModel = TracksModel;    
    this.CompanyModel = CompanyModel;
    this.BankModel = BankModel;
    this.BranchModel = BranchModel;
    this.IDModel = IDModel;
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
                    app.UsersModel.update({payment_number : paymentId, company_id : 1}, {where : {id : user.id}}).then(tmpuser=>{
                        if(tmpuser){
                            app.UsersModel.findOne({where : {id : user.id}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status']}).then(user =>{
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
                    app.CompanyModel.create({name : user.cname.toLowerCase(), location : user.lname}).then(company=>{
                        if(company){

                            //Update user
                            app.UsersModel.update({payment_number : paymentId, company_id: company.id}, {where : {id : user.id}}).then(tmpuser=>{
                                if(tmpuser){
                                    app.UsersModel.findOne({where : {id : user.id}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status']}).then(user =>{
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

    const utilsRouter = express.Router();
    const expressApp = express();
    
    utilsRouter.use(bodyParser.json({limit: '50mb'}));
    utilsRouter.use(bodyParser.urlencoded({limit: '50mb', extended: true}));   

    //utilsRouter.use(express_formidable());
    

    const utils = require('../services/utils');
    //let upload  = multer({storage: app.storage}).any();

    expressApp.set('token', d.config.secret);
    

    utilsRouter.route('/login')
    .get((req, res)=>{

        if(req.query && req.query.username.trim().length > 0 && req.query.password.trim().length > 0){
            if(utils.isValidEmail(req.query.username.trim())){
                app.UsersModel.findOne({where : {email : req.query.username, password : utils.getHash(req.query.password)}, attributes : ['id','firstname','lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'is_admin','status']}).then(user => {
                    if(user){
                        const token = jwt.sign({user}, expressApp.get('token'), {expiresIn: '1h'});
                        res.status(200).json({
                            success: true,
                            message: 'Successful',
                            token: token,
                            user : user
                          });
                    }else{
                        res.status(400).json('something wrong happened');
                    }
                });
            }else if(utils.isValidMSISDN(req.query.username.trim())){
                app.UsersModel.findOne({where : {msisdn : req.query.username, password : utils.getHash(req.query.password)}}).then(user => {
                    if(user){
                        res.status(200).json(user);
                    }else{
                        res.status(400).send('something wrong happened');
                    }
                });
            }
        }else{
            res.status(200).send('Data not received');                                                                    
        }
    });  

    utilsRouter.route('/is_email_exist/:email')
        .get((req, res)=>{ 
            if(utils.isValidEmail(req.params.email.trim())){
                app.UsersModel.findOne({where : {email : req.params.email}}).then(user => {
                    if(user){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(200).send('Wrong EMAIL format');
            }
        });   

    utilsRouter.route('/banks')
        .get((req, res)=>{ 
            app.BankModel.findAll({where : {status : 'A'}}).then((banks)=>{
                res.status(200).json(banks);
            })
        }); 
        
    utilsRouter.route('/idtypes')
        .get((req, res)=>{ 
            app.IDModel.findAll({where : {status : 'A'}}).then((ids)=>{
                res.status(200).json(ids);
            })
        });

    utilsRouter.route('/branches/:bank_id')
        .get((req, res)=>{ 
            app.BranchModel.findAll({where : {status : 'A', bank_id: req.params.bank_id}}).then((branches)=>{
                res.status(200).json(branches);
            })
        });  

    utilsRouter.route('/is_msisdn_exist/:msisdn')
        .get((req, res)=>{  
            if(utils.isValidMSISDN(req.params.msisdn.trim())){
                app.UsersModel.findOne({where : {msisdn : req.params.msisdn}}).then(user => {
                    if(user){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(200).json('Wrong MSISN format');
            }
        }); 

    utilsRouter.route('/is_corporate_exist/:corporate')
        .get((req, res)=>{  
            if(req.params.corporate.toLowerCase().trim()){
                app.CompanyModel.findOne({where : {name : req.params.corporate}}).then(company => {
                    if(company){
                        res.status(200).json({is_exist : true});                    
                    }else{
                        res.status(200).json({is_exist : false});                                        
                    }
                });
            }else{
                res.status(200).json('Wrong corporate name');
            }
        });

    utilsRouter.route('/banks')
        .get((req, res)=>{  
            app.BankModel.findAll({where : {status : 'A'}}).then(banks => {
                if(banks){
                    res.status(200).json(banks);                    
                }else{
                    res.status(200).send('No Banks Available');                                        
                }
            });
        });

    utilsRouter.route('/adduser')
        .post((req, res)=>{
        
          if(Object.keys(req.body) != 0){
                req.body.is_admin = 'N';
                app.UsersModel.create(req.body).then((user)=>{
                    if(user && req.body.type === 'C'){
                        user.lname = req.body.lname;
                        user.cname = req.body.cname;

                        app.updateCompanyPaymentNumber(user, res);
                    }else if(user && req.body.type === 'I'){
                        app.updateIndividualPaymentNumber(user, res);
                    }
                });
          }else if(Object.keys(req.query) != 0){
                req.query.is_admin = 'N';            
                app.UsersModel.create(req.query).then((user)=>{
                    if(user && req.query.type === 'C'){
                        user.lname = req.query.lname;
                        user.cname = req.query.cname;

                        app.updateCompanyPaymentNumber(user, res);
                    }else if(user && req.body.type === 'I'){
                        app.updateIndividualPaymentNumber(user, res);
                    }
                }).catch((error)=>{
                    if(error)
                        res.status(400).send('Could not save data');
                });
          }else{
              console.log('Passed NONE !!!');
              res.status(400).send('JSON format required');
          }
    }); 

    utilsRouter.use('/adduploader', (req, res, next)=>{
        console.log();
        const app = express();
            //JSON Web Token Secret
            app.set('token', d.config.secret);
    
                // check header or url parameters or post parameters for token
            const token = req.body.token || req.query.token || req.headers['x-access-token'];
            
            // decode token
            if(token) {
        
                // verifies secret and checks exp
                jwt.verify(token, app.get('token'), function(err, decoded) {      
                    if (err) {
                        return res.json({ success: false, message: 'Failed to authenticate token.' });    
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;    
                        next();
                    }
                });
        
            }else{
        
                // if there is no token
                // return an error
                return res.status(403).send({ 
                    success: false, 
                    message: 'No token provided.' 
                });
        
            }
    })
        

    utilsRouter.route('/adduser')
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

                    app.updateCompanyPaymentNumber(user, res);
                }else if(user && req.body.type === 'I'){
                    app.updateIndividualPaymentNumber(user, res);
                }
            }).catch((error)=>{
                if(error)
                    res.status(400).send('Could not save data');
            });
      }else{
          console.log('Passed NONE !!!');
      }
    }); 

    utilsRouter.route('/statement/upload')
        .post((req, res)=> {
            // req.file is the `avatar` file 
            // req.body will hold the text fields, if there were any 
           
            utils.saveFile(req, res);
        })

    utilsRouter.route('/statement/json')
        .get((req, res)=> {
            //res.status(200).json(utils.xlsxToJSON('ecobank_test.xlsx'));
        })

    // utilsRouter.route('/statement/upload')
    //     .post((req, res)=> {
    //         const formidable = require('formidable');
    //         let form = new formidable.IncomingForm();
            
    //         form.parse(req, (err, fields, files)=>{
    //             res.writeHead(200, {'content-type': 'text/plain'});
    //             res.write('received upload:\n\n');
    //             res.end(util_.inspect({fields: fields, files: files}));
    //             console.log('Done writing ...');
    //         });

    //         //res.status(200).send('successfull');
    //     })    

    // utilsRouter.route('/statement/upload')
    //     .post((req, res)=> {
    //         console.log(req.fields);
    //         console.log(req.files);

    //         res.status(200).send('successfull');
    //     })

        return utilsRouter;
}

    // upload(){
        
    //     return multer({storage : this.storage()});
    // }

    // storage() {

    //     return multer.diskStorage({
    //             destination: (req, file, cb) => {
    //                 cb(null, '/Users/selby/Documents/inflexion_hrcf/app/resources/')
    //             },
    //             filename: (req, file, cb) => {
    //                 cb(null, file.file + '-' + Date.now())
    //             }
    //     });
    // }


}
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

saveFile(req, res){
    const fs = require('fs-extended');
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            var path = require('path');
            var dest = path.resolve('./uploads');
            fs.ensureDirSync(dest);
            callback(null, dest);
          },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now()+'.xlsx');
          }
    });
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 256 * 1024 * 1024
        },
        fileFilter: function(req, file, cb) {
            cb(null, true)
       }
    }).single('file');

    upload(req, res, (err)=>{
        if (err) {
            console.log(err);
            return res.status(400).end('Error');
        } else {
            if(req.file){
                console.log(req.file);
                this.convertExcelToArray(req, res, req.file.path);
            }
            res.end('File uploaded');
        }
    });
}

convertExcelToArray(req, res, filename){
    const parseXlsx = require('excel');
    
     parseXlsx(filename, (err, data)=>{
         if(err) throw err;
 
         this.compute(req, res, data);
         return data;
     });
}

compute(req, res, data){
    if(data){
        var _ = require('lodash');

        //Import Models
        const models = require('../models/models');
        const sequelize = require('../config').sequelize;

        const creditModel = models.creditModel(sequelize);
        const transactionModel = models.transactionModel(sequelize);
        const usersModel = models.usersModel(sequelize);
        const bankStatementModel = models.bankStatementModel(sequelize);
        const icBanksModel = models.ICBankModel(sequelize);

        var async = require('async');
        var map = require("async/map");
        //Verify fields
        const fields = data[0];

        if(fields[0].trim().toLowerCase() === 'date' && 
            fields[1].trim().toLowerCase() === 'bank account no' &&
            fields[2].trim().toLowerCase() === 'ledger account' &&
            fields[3].trim().toLowerCase() === 'credit' &&
            fields[4].trim().toLowerCase() === 'debit' &&
            fields[5].trim().toLowerCase() === 'counterparty code' &&
            fields[6].trim().toLowerCase() === 'description' && 
            fields[7].trim().toLowerCase() === 'sponsor code' && 
            fields[8].trim().toLowerCase() === 'client code'){

                console.log('header passed');
                //Prepare objects for transactions
                var transactionMap = [];
                
                data.map((obj, i)=>{
                    if(i > 0){
                        const objArray = obj.toString().split(',');
                        if(objArray[0].trim().length > 3){
                            transactionMap.push({date : objArray[0], account_number : objArray[1], ledger_account : objArray[2], credit : objArray[3], debit : objArray[4], counterparty_code : objArray[5], description : objArray[6], sponsor_code : objArray[7], client_code : objArray[8]});
                        }
                    }
                });

                console.log('Transaction statement length => '+transactionMap.length+', Transaction => '+JSON.stringify(transactionMap));

                const HRCFData = _.filter(transactionMap, (statement)=>{ return statement.client_code.trim().length === 11});

                console.log('HRCF length => '+HRCFData.length);
                
                if(HRCFData){
                    let HRCFDataWithUserIds = [];

                        HRCFData.map((data)=>{
                        usersModel.findOne({where : {payment_number : data.client_code}, individualHooks: true})
                        .then((user)=>{
                            if(user){
                                return user.increment({'balance' : parseFloat(data.credit)})
                                .then((user)=>{
                                    return user
                                });  
                            }else{
                                res.status(200).json({success : true});
                            }
                        }).then((user)=>{
                            icBanksModel.findOne({where : {account_number : data.account_number}}).then((icBank)=>{
                                if(icBank){
                                    creditModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id,bank_id:icBank.id});
                                    transactionModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id});
                                }
                            });

                        })   
                    });

                }

                //Create Bank Statement
                transactionMap.map((data)=>{
                    bankStatementModel.create({ledger_account : data.ledger_account,
                        credit : data.credit,
                        debit : data.debit,
                        counterparty_code : data.counterparty_code,
                        description : data.description,
                        sponsor_code : data.sponsor_code,
                        client_code : data.client_code,
                        account_number : data.account_number
                    });
                })
                
        }else{
            console.log('Wrong fields ...');
        }
    }
}

};
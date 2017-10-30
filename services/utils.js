const _ = require('lodash');

exports.getHash = function(password){
    const crypto = require('crypto');
    const secret = 'thequickfoxjumpedoverthelazydog';
    const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    return hash;
}

exports.isValidEmail = function(email){
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.isValidMSISDN = function(msisdn){
    if(msisdn.length === 10){
        const tmpText = _.toArray(msisdn);
        const result = _.map(tmpText, (it)=>{
            if(!(_.toUpper(it) === _.toLower(it))){
                console.log('Text contains alphabets');
                return false;
            }
        })

        return !(_.includes(result, false));
    }else{
        return false;
    }
}

exports.xlsxToJSON = function(filename){

    var parseXlsx = require('excel');
   
    parseXlsx('./uploads/ecobank.xlsx', function(err, data) {
        if(err) throw err;

        console.log(JSON.stringify(data));
        return data;
    });
}

exports.sendEmail = function(sender, title, message){
    var config = require('../config').config;
    var smtpTransport = require('nodemailer-smtp-transport');
    var nodemailer = require('nodemailer');

     // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
        service : 'gmail',
        host: config.email_host,
        
        auth: {
            user: config.email_username, // generated ethereal user
            pass: config.email_password  // generated ethereal password
        }
      })
    );

     // setup email data with unicode symbols
    let mailOptions = {
        from: '"HRCF Confirmation" <noreply@icassetmanagers.com>', // sender address
        to: sender, // list of receivers
        subject: title, // Subject line
        text: message, // plain text body
        //html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

exports.saveFile = function(req, res){
    var fs = require('fs-extended');
    var multer = require('multer');
    var storage = multer.diskStorage({
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
    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 256 * 1024 * 1024
        },
        fileFilter: function(req, file, cb) {
            cb(null, true)
       }
    }).single('file');

    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end('Error');
        } else {
            if(req.file){
                console.log(req.file);

                var parseXlsx = require('excel');
                
                 parseXlsx(req.file.path, function(err, data) {
                     if(err) throw err;
             
                        //console.log(JSON.stringify(data));
                    //  return data;

                    compute(req, res, data);
                 });

            }
            res.end('File uploaded');
        }
    });
}

var compute = function(req, res, data){
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

                const HRCFData = _.filter(transactionMap, (statement)=>{ return statement.client_code.trim().length === 12});

                if(HRCFData){
                    let HRCFDataWithUserIds = [];

                    async.map(HRCFData, (data, callback)=>{
                        usersModel.findOne({where : {payment_number : data.client_code}, individualHooks: true}).then((user)=>{
                            if(user){
                                user.increment({'balance' : parseFloat(data.credit)}).then((user)=>{
                                    callback(null, user);
                                });  
                                
                                icBanksModel.findOne({where : {account_number : data.account_number}}).then((icBank)=>{
                                    if(icBank){
                                        creditModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id,bank_id:icBank.id});
                                        transactionModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id});
                                    }
                                });
                                
                            }
                        });

                        
                    }, (err, results)=>{
                        if(err){
                            console.log(err);
                        }
                        //console.log('Model ::: '+results);
                    })
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

// exports.saveFile = function(req, res){
//     var Busboy = require('busboy');

//     var busboy = new Busboy({ headers: req.headers });
//     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//         console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
//         file.on('data', function(data) {
//           console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
//         });
//         file.on('end', function() {
//           console.log('File [' + fieldname + '] Finished');
//         });
//     });

//     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
//         console.log('Field [' + fieldname + ']: value: ' + inspect(val));
//     });

//     busboy.on('finish', function() {
//         console.log('Done parsing form!');
//     res.writeHead(303, { Connection: 'close', Location: '/' });
//     res.end();
//     });
// }

// exports.saveFile = function(req, res){

//     var multiparty = require('multiparty');
//     var util = require('util');
//     var form = new multiparty.Form();
    
//        form.parse(req, function(err, fields, files) {
//          res.writeHead(200, {'content-type': 'text/plain'});
//          res.write('received upload:\n\n');
//          res.end(util.inspect({fields: fields, files: files}));
//        });
// }
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


exports.saveID = function(req, res){
    const models = require('../models/models');
    const sequelize = require('../config').sequelize;    
    const usersModel = models.usersModel(sequelize);
    const imageMapModel = models.imageMapModel(sequelize);

    var imgFilename = '';
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
            imgFilename = Date.now()+'.jpg';
            callback(null, imgFilename);
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
            if(req.file && req.body){
                console.log(req.file);
                console.log(req.body);
                const user_id = req.body.user_id;

                imageMapModel.findOne({where : {user_id , status : 'A'}})
                .then((mapper)=>{
                    if(mapper){
                        mapper.update({filename : imgFilename});
                    }else{
                        imageMapModel.create({user_id : req.body.user_id, filename : imgFilename});
                    }
                    res.status(200).json({success : true});
                })

            }else{
                res.end('Unsuccessful Upload');
            }
        }
    });
}

exports.saveFile = function(req, res){
    const models = require('../models/models');
    const sequelize = require('../config').sequelize;    
    const usersModel = models.usersModel(sequelize);

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
            if(req.file && req.body){
                console.log(req.file);
                console.log(req.body);

                const ic_bank_id = req.body.bank_id;

                usersModel.findOne({where : {id : req.body.user_id, is_admin : 'Y', status : 'A'}})
                .then(function(user){
                    if(user){
                        // var parseXlsx = require('excel');
                        
                        // parseXlsx(req.file.path, function(err, data) {
                        //     if(err) throw err;
                        //     compute(req, res, data, ic_bank_id);
                        // });


                        var xlsx = require('xlsx');
                        var workbook = xlsx.readFile(req.file.path);
                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        var data = xlsx.utils.sheet_to_json(worksheet);

                        console.log('sheet => '+JSON.stringify(data));

                        compute2(req, res, data, ic_bank_id);

                    }else{
                        res.status(400).json({success: false});
                    }
                })

            }else{
                res.end('Unsuccessful Upload');
            }
        }
    });
}

exports.sendApprovalEmail = function(name, email, uuid, code){
    var config = require('../config').config;

    var baseUrl = config.IP+':'+config.PORT;
    sendEmail(email, 'Approve Request', approveEmailTemplate(baseUrl, code, name, uuid));
} 

var sendEmail = function(sender, title, message){
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
        from: '"HRCF" <noreply@icassetmanagers.com>', // sender address
        to: sender, // list of receivers
        subject: title, // Subject line
        html: message, // plain text body
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

var compute2 = function(req, res, data, ic_bank_id){
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

        if(data){

                console.log('header passed');
                //Prepare objects for transactions
                var transactionMap = [];
                
                data.map((obj, i)=>{
                    transactionMap.push({date : obj.date, account_number : obj.bank_account, ledger_account : obj.ledger_account, credit : getNumber(obj.credit), debit : getNumber(obj.debit), description : obj.description, client_code : obj.client_code, fund_code : obj.fund_code, currency : obj.currency, security_issuer_code: obj.security_issuer_code, counter_party_code : obj.counter_party_code, sponsor_code: obj.sponsor_code});
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
                                const credit = data.credit.trim();
                                return user.increment({'actual_balance' : parseFloat(credit)})
                                .then((user)=>{
                                    user.increment({'available_balance' : parseFloat(credit)});

                                    const newBalance = user.available_balance;
                                    //Send an email
                                    sendEmail(user.email, 'Account Update', creditEmailTemplate(user.firstname, credit, newBalance));
                                    return user
                                });  
                            }
                        }).then((user)=>{
                            if(user){
                                icBanksModel.findOne({where : {account_number : data.account_number, status : 'A'}}).then((icBank)=>{
                                    if(icBank){
                                        creditModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id,bank_id:icBank.id});
                                        transactionModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id});
                                    }
                                });
                            }

                        })   
                    });

                }

                res.status(200).json({success : true});

                //Create Bank Statement
                transactionMap.map((data, i)=>{
                    return bankStatementModel
                    .create({ledger_account : data.ledger_account,
                        credit : data.credit,
                        debit : data.debit,
                        date : data.date,
                        description : data.description,
                        fund_code : data.fund_code,
                        client_code : data.client_code,
                        security_issuer_code : data.security_issuer_code,
                        currency : data.currency,                        
                        account_number : data.account_number,
                        ic_bank_id : ic_bank_id,
                        counter_party_code : data.counter_party_code,
                        sponsor_code : data.sponsor_code
                    })
                })
                
        }else{
            console.log('Wrong fields ...');
        }
    }
}

var getNumber = function(value){
    if(value.includes(',')){
        var valueTokens = value.split(',');
        var newValue = '';

        valueTokens.map((token)=>{
            newValue = newValue + token;
        })

        return newValue;
    }


    return value;
}

var registeringEmailTemplate = function(name){
   
       return `<html>
       <head>
       
           <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
           <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
           <meta name="format-detection" content="telephone=no" />
             <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
           <title>HRCF</title>
           <style type="text/css">
               
               /* ==> Importing Fonts <== */
               @import url(https://fonts.googleapis.com/css?family=Fredoka+One);
               @import url(https://fonts.googleapis.com/css?family=Quicksand);
               @import url(https://fonts.googleapis.com/css?family=Open+Sans);
       
               /* ==> Global CSS <== */
               .ReadMsgBody{width:100%;background-color:#ffffff;}
               .ExternalClass{width:100%;background-color:#ffffff;}
               .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}
               html{width: 100%;}
               body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;}
               table{border-spacing:0;border-collapse:collapse;}
               table td{border-collapse:collapse;}
               img{display:block !important;}
               a{text-decoration:none;color:#e91e63;}
       
               /* ==> Responsive CSS For Tablets <== */
               @media only screen and (max-width:640px) {
                   body{width:auto !important;}
                   table[class="tab-1"] {width:450px !important;}
                   table[class="tab-2"] {width:47% !important;text-align:left !important;}
                   table[class="tab-3"] {width:100% !important;text-align:center !important;}
                   img[class="img-1"] {width:100% !important;height:auto !important;}
               }
       
               /* ==> Responsive CSS For Phones <== */
               @media only screen and (max-width:480px) {
                   body { width: auto !important; }
                   table[class="tab-1"] {width:290px !important;}
                   table[class="tab-2"] {width:100% !important;text-align:left !important;}
                   table[class="tab-3"] {width:100% !important;text-align:center !important;}
                   img[class="img-1"] {width:100% !important;}
               }
       
           </style>
       </head>
       <body bgcolor="#f6f6f6">
           <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
               <tr >
                   <td align="center">
                       <table class="tab-1" align="center" cellspacing="0" cellpadding="0" width="600">
       
                           <tr><td height="60"></td></tr>
                           <!-- Logo -->
                           <tr>
                                       <td align="center">
                                           <img src="img/01-logo.png" alt="Logo" width="87">
                                       </td>
       
                           </tr>
       
                           <tr><td height="35"></td></tr>
       
                           <tr>
                               <td>
       
                                   <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >
                                       <tr >
                                           <td align="left" style="font-family: 'open Sans', sans-serif; font-weight: bold; letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 40px; padding-right: 40px">
                                               Hey`+name+`,
                                           </td>
                                       </tr>
                                       <tr><td height="10"></td></tr>
                                       <tr>
       
                                           <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px">
                                               Thanks for registering for an account on HRCF! Before we get started, we just need to confirm that this is you. Click below to verify your email address:
                                           </td>
                                       </tr>
                                       <tr>
                                           <td style="padding-bottom: 50px; padding-left: 40px; padding-right: 40px" >
                                               <table align="center" bgcolor="#0d47a1" >
                                                   <tr >
                                                       <td align="center" style="font-family: 'open sans', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 15px 25px;">
                                                           <a href="#" style="color: #fff">VERIFY</a>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                   </table>
                                   <tr>
                                           <td style="padding-top: 10px; font-family: 'open sans', sans-serif; " align="center">
                                               <p style="color:#737f8d;text-align:'center' ">
                                                   <small >
                                                       <span >You're receiving this email because you signed up for and account on HRCF</span><br />
                                                       <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />
                                                       <span >P.M.B 104, GP Accra - Ghana</span>
                                                   </small>
                                               </p>
                                           </td>
                                       </tr>
       
                                   
                                   
                               </td>
                           </tr>
       
                           <tr><td height="60"></td></tr>
       
                       </table>
                   </td>
               </tr>
           </table>
        </body>
       </html>`
}

var creditEmailTemplate = function(name, amount, balance){
    
        return `<html>
        <head>
        
            <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
            <meta name="format-detection" content="telephone=no" />
              <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
            <title>HRCF</title>
            <style type="text/css">
                
                /* ==> Importing Fonts <== */
                @import url(https://fonts.googleapis.com/css?family=Fredoka+One);
                @import url(https://fonts.googleapis.com/css?family=Quicksand);
                @import url(https://fonts.googleapis.com/css?family=Open+Sans);
        
                /* ==> Global CSS <== */
                .ReadMsgBody{width:100%;background-color:#ffffff;}
                .ExternalClass{width:100%;background-color:#ffffff;}
                .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}
                html{width: 100%;}
                body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;}
                table{border-spacing:0;border-collapse:collapse;}
                table td{border-collapse:collapse;}
                img{display:block !important;}
                a{text-decoration:none;color:#e91e63;}
        
                /* ==> Responsive CSS For Tablets <== */
                @media only screen and (max-width:640px) {
                    body{width:auto !important;}
                    table[class="tab-1"] {width:450px !important;}
                    table[class="tab-2"] {width:47% !important;text-align:left !important;}
                    table[class="tab-3"] {width:100% !important;text-align:center !important;}
                    img[class="img-1"] {width:100% !important;height:auto !important;}
                }
        
                /* ==> Responsive CSS For Phones <== */
                @media only screen and (max-width:480px) {
                    body { width: auto !important; }
                    table[class="tab-1"] {width:290px !important;}
                    table[class="tab-2"] {width:100% !important;text-align:left !important;}
                    table[class="tab-3"] {width:100% !important;text-align:center !important;}
                    img[class="img-1"] {width:100% !important;}
                }
        
            </style>
        </head>
        <body bgcolor="#f6f6f6">
            <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
                <tr >
                    <td align="center">
                        <table class="tab-1" align="center" cellspacing="0" cellpadding="0" width="600">
        
                            <tr><td height="60"></td></tr>
                            <!-- Logo -->
                            <tr>
                                        <td align="center">
                                            <img src="img/01-logo.png" alt="Logo" width="87">
                                        </td>
        
                            </tr>
        
                            <tr><td height="35"></td></tr>
        
                            <tr>
                                <td>
        
                                    <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >
                                        <tr >
                                            <td align="left" style="font-family: 'open Sans', sans-serif; font-weight: bold; letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 40px; padding-right: 40px">
                                                Hey `+name+`,
                                            </td>
                                        </tr>
                                        <tr><td height="10"></td></tr>
                                        <tr>
        
                                            <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px">
                                                Thanks for registering for an account on HRCF! Before we get started, we just need to confirm that this is you. Click below to verify your email address:
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom: 50px; padding-left: 40px; padding-right: 40px" >
                                                <table align="center" bgcolor="#0d47a1" >
                                                    <tr >
                                                        <td align="center" style="font-family: 'open sans', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 15px 25px;">
                                                            <a href="#" style="color: #fff">VERIFY</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <tr>
                                            <td style="padding-top: 10px; font-family: 'open sans', sans-serif; " align="center">
                                                <p style="color:#737f8d;text-align:'center' ">
                                                    <small >
                                                        <span >You're receiving this email because you signed up for and account on HRCF</span><br />
                                                        <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />
                                                        <span >P.M.B 104, GP Accra - Ghana</span>
                                                    </small>
                                                </p>
                                            </td>
                                        </tr>
        
                                    
                                    
                                </td>
                            </tr>
        
                            <tr><td height="60"></td></tr>
        
                        </table>
                    </td>
                </tr>
            </table>
         </body>
        </html>`
 }

 
 var approveEmailTemplate = function(baseUrl, code, name, uuid){
    
        return `<html>
        <head>
        
            <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
            <meta name="format-detection" content="telephone=no" />
              <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
            <title>HRCF</title>
            <style type="text/css">
                
                /* ==> Importing Fonts <== */
                @import url(https://fonts.googleapis.com/css?family=Fredoka+One);
                @import url(https://fonts.googleapis.com/css?family=Quicksand);
                @import url(https://fonts.googleapis.com/css?family=Open+Sans);
        
                /* ==> Global CSS <== */
                .ReadMsgBody{width:100%;background-color:#ffffff;}
                .ExternalClass{width:100%;background-color:#ffffff;}
                .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}
                html{width: 100%;}
                body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;}
                table{border-spacing:0;border-collapse:collapse;}
                table td{border-collapse:collapse;}
                img{display:block !important;}
                a{text-decoration:none;color:#e91e63;}
        
                /* ==> Responsive CSS For Tablets <== */
                @media only screen and (max-width:640px) {
                    body{width:auto !important;}
                    table[class="tab-1"] {width:450px !important;}
                    table[class="tab-2"] {width:47% !important;text-align:left !important;}
                    table[class="tab-3"] {width:100% !important;text-align:center !important;}
                    img[class="img-1"] {width:100% !important;height:auto !important;}
                }
        
                /* ==> Responsive CSS For Phones <== */
                @media only screen and (max-width:480px) {
                    body { width: auto !important; }
                    table[class="tab-1"] {width:290px !important;}
                    table[class="tab-2"] {width:100% !important;text-align:left !important;}
                    table[class="tab-3"] {width:100% !important;text-align:center !important;}
                    img[class="img-1"] {width:100% !important;}
                }
        
            </style>
        </head>
        <body bgcolor="#f6f6f6">
            <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">
                <tr >
                    <td align="center">
                        <table class="tab-1" align="center" cellspacing="0" cellpadding="0" width="600">
        
                            <tr><td height="60"></td></tr>
                            <!-- Logo -->
                            <tr>
                                        <td align="center">
                                            <img src="img/01-logo.png" alt="Logo" width="87">
                                        </td>
        
                            </tr>
        
                            <tr><td height="35"></td></tr>
        
                            <tr>
                                <td>
        
                                    <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >
                                        <tr >
                                            <td align="left" style="font-family: 'open Sans', sans-serif;letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 40px; padding-right: 40px">
                                            Dear `+name+`,
                                            <br>
                                            <br>
                                            A cash withdrawal has been initiated on your investment account held with us
                                            </td>
                                        </tr>
                                        <tr><td height="10"></td></tr>
                                        <tr>
        
                                            <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px">
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px;word-spacing: 3px;">
                                                Your approval code: <span style="font-weight:600;font-size: 24px;letter-spacing: 1px">`+code+`</span>
                                                <br>
                                                <br>
                                                Click below to authorize the transaction by entering your approval code, or reject transaction. <br/>
                                                This code is required to complete the transaction.
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style="padding-bottom: 50px; padding-left: 40px; padding-right: 40px" >
                                                <table align="center" bgcolor="#0d47a1" >
                                                    <tr >
                                                        <td align="center" style="font-family: 'open sans', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 15px 25px;">
                                                            <a href="`+baseUrl+`/confirm/`+uuid+`" style="color: #fff">GO TO APPROVE</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <tr>
                                            <td style="padding-top: 10px; font-family: 'open sans', sans-serif; " align="center">
                                                <p style="color:#737f8d;text-align:'center' ">
                                                    <small >
                                                        <span >You're receiving this email because you signed up for and account on HRCF</span><br />
                                                        <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />
                                                        <span >P.M.B 104, GP Accra - Ghana</span>
                                                    </small>
                                                </p>
                                            </td>
                                        </tr>
        
                                    
                                    
                                </td>
                            </tr>
        
                            <tr><td height="60"></td></tr>
        
                        </table>
                    </td>
                </tr>
            </table>
         </body>
        </html>`
 }


// var compute = function(req, res, data){
//     if(data){
//         var _ = require('lodash');

//         //Import Models
//         const models = require('../models/models');
//         const sequelize = require('../config').sequelize;

//         const creditModel = models.creditModel(sequelize);
//         const transactionModel = models.transactionModel(sequelize);
//         const usersModel = models.usersModel(sequelize);
//         const bankStatementModel = models.bankStatementModel(sequelize);
//         const icBanksModel = models.ICBankModel(sequelize);

//         var async = require('async');
//         var map = require("async/map");
//         //Verify fields
//         const fields = data[0];

//         if(fields[0].trim().toLowerCase() === 'date' && 
//             fields[1].trim().toLowerCase() === 'bank account no' &&
//             fields[2].trim().toLowerCase() === 'ledger account' &&
//             fields[3].trim().toLowerCase() === 'credit' &&
//             fields[4].trim().toLowerCase() === 'debit' &&
//             fields[5].trim().toLowerCase() === 'counterparty code' &&
//             fields[6].trim().toLowerCase() === 'description' && 
//             fields[7].trim().toLowerCase() === 'sponsor code' && 
//             fields[8].trim().toLowerCase() === 'client code'){


//                 console.log('header passed');
//                 //Prepare objects for transactions
//                 var transactionMap = [];
                
//                 data.map((obj, i)=>{
//                     if(i > 0){
//                         const objArray = obj.toString().split(',');
//                         if(objArray[0].trim().length > 3){
//                             transactionMap.push({date : objArray[0], account_number : objArray[1], ledger_account : objArray[2], credit : objArray[3], debit : objArray[4], counterparty_code : objArray[5], description : objArray[6], sponsor_code : objArray[7], client_code : objArray[8]});
//                         }
//                     }
//                 });

//                 const HRCFData = _.filter(transactionMap, (statement)=>{ return statement.client_code.trim().length === 11});

//                 if(HRCFData){
//                     let HRCFDataWithUserIds = [];

//                     async.map(HRCFData, (data, callback)=>{
//                         usersModel.findOne({where : {payment_number : data.client_code}, individualHooks: true}).then((user)=>{
//                             if(user){
//                                 user.increment({'balance' : parseFloat(data.credit)}).then((user)=>{
//                                     callback(null, user);
//                                 });  
                                
//                                 icBanksModel.findOne({where : {account_number : data.account_number}}).then((icBank)=>{
//                                     if(icBank){
//                                         creditModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id,bank_id:icBank.id});
//                                         transactionModel.create({amount : data.credit,type : 'C',narration : data.description,user_id : user.id});
//                                     }
//                                 });
                                
//                             }
//                         });

                        
//                     }, (err, results)=>{
//                         if(err){
//                             console.log(err);
//                         }
//                         //console.log('Model ::: '+results);
//                     })
//                 }

//                 //Create Bank Statement
//                 transactionMap.map((data)=>{
//                     bankStatementModel.create({ledger_account : data.ledger_account,
//                         credit : data.credit,
//                         debit : data.debit,
//                         counterparty_code : data.counterparty_code,
//                         description : data.description,
//                         sponsor_code : data.sponsor_code,
//                         client_code : data.client_code,
//                         account_number : data.account_number
//                     });
//                 })
                
//         }else{
//             console.log('Wrong fields ...');
//         }
//     }
// }
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

exports.capitalizeWord = function(name){
    var _ = require('lodash');
    
    var value = _.capitalize(name);

    if(value.includes('-')){
        var tokens = value.split('-');
        var newName = '';
        tokens.map((tmpName)=>{
            newName = newName +_.capitalize(tmpName.trim())+'-';
        });

        value = newName.substr(0,newName.length-1);
    }

    if(value.includes(' ')){
        var tokens = value.split(' ');
        var newName = '';
        tokens.map((tmpName)=>{
            newName = newName +_.capitalize(tmpName.trim())+' ';
        });

        value = newName.trim(); 
    }

    return value;
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

exports.sendDebitMail = function(email, name, amount, date, bank, account_name, account_number){
    const msg = debitEmailTemplate(name, amount, date, bank, account_name, account_number);
    sendEmail(email, 'Debit', msg);
}

exports.sendWelcomeMail = function(email, name){
    const msg = welcomeEmailTemplate(name);
    sendEmail(email, 'Welcome', msg);
}

exports.sendCreditMail = function(email, name, amount, date){
    const msg = creditEmailTemplate(name, amount, date);
    sendEmail(email, 'Credit', msg);
}

exports.sendResetMail = function(email, name, uuid){
    const config = require('../config').config;
    const baseUrl = config.IP+':'+config.PORT;

    const msg = forgotEmailTemplate(name, baseUrl, uuid);
    sendEmail(email, 'Reset Password', msg);
}

exports.getUniqCollection = function(data, field){
    var _ = require('lodash');

    var allValues = [];

    data.map((d)=>{
      return allValues.push(d[field]);
    })

    var uniqFields = _.uniq(allValues);
    
    var filteredData = [];

    uniqFields.map((d)=>{
        const found = data.find((ld)=>{return ld[field] === d});
        if(found){
            filteredData.push(found);
        }
    });

    return filteredData;
}

var sendCreditMail2 = function(email, name, amount, date){
    const msg = creditEmailTemplate(name, amount, date);
    sendEmail(email, 'Credit', msg);
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
                                    sendCreditMail2(user.email, user.firstname, credit, data.date);                                    
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
                });

                //Send to AMS
                let ams_data = [];
                transactionMap.map((transact)=>{
                    //format to AMS
                    ams_data.push({ledgerAccount : transact.ledger_account,
                                    fundCode : transact.fund_code,
                                    credit : transact.credit,
                                    debit : transact.debit,
                                    sponsorCode : transact.sponsor_code,
                                    counterpartyCode : transact.counter_party_code,
                                    bankAccountNo : transact.account_number,
                                    description : transact.description});
                });



                var config = require('../config');
                url = config.config.ams_excel;

                request({
                    uri: url,
                    method: 'POST',
                    json: true,
                    body : ams_data,
                }, function(error, res, body){
                    if(error) {
                        console.log('There was an error');
                        return;
                    }

                    console.log('Res => '+body);
                });	
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

var forgotEmailTemplate = function(name, url, uuid){
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" >
    <head>
    
        <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <meta name="format-detection" content="telephone=no" />
          <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
        <title>HRCF | Reset</title>
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
                                        <img src="data:image/png;base64,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"  alt="Logo" width="150" height="75">
                                    </td>
    
                        </tr>
    
                        <tr><td height="35"></td></tr>
    
                        <tr>
                            <td>
    
                                <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >
                                    <tr >
                                        <td align="left" style="font-family: 'open Sans', sans-serif; font-weight: bold; letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 60px; padding-right: 60px">
                                            Hello `+name+`,
                                        </td>
                                    </tr>
                                    <tr><td height="20"></td></tr>
                                    <tr>
    
                                        <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 30px; padding-left: 60px; padding-right: 60px">
                                            We received a request to reset your HRCF password.Click the button below to reset your password. The link will take you to a page where you can create and confirm a new password.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 30px; padding-left: 80px; padding-right: 80px" >
                                            <table align="center" bgcolor="#0d47a1" >
                                                <tr >
                                                    <td align="center" style="font-family: 'open sans', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 13px 35px;">
                                                        <a href="`+url+`/#/reset/`+uuid+`" style="color: #fff">RESET PASSWORD</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
    
                                        <td align="left" style="color: #737f8d; font-family: 'open sans',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 60px; padding-right: 60px">
                                            If you weren't trying to reset your password, don't worry - your account is still secure and no one has been given access to it.
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
    </html>`;
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

var creditEmailTemplate = function(name, amount, date){
    
        return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width"/>
            <title>HRCF | Credit</title>
        <style type="text/css">
            /*////// RESET STYLES //////*/
            body{height:100% !important; margin:0; padding:0; width:100% !important;}
            table{border-collapse:separate;}
            img, a img{border:0; outline:none; text-decoration:none;}
            h1, h2, h3, h4, h5, h6{margin:0; padding:0;}
            p{margin: 1em 0;}
        
            /*////// CLIENT-SPECIFIC STYLES //////*/
            .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}
            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%;}
            table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}
            #outlook a{padding:0;}
            img{-ms-interpolation-mode: bicubic;}
            body, table, td, p, a, li, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;}
                
            /*////// GENERAL STYLES //////*/
            img{ max-width: 100%; height: auto; }
            
            /*////// TABLET STYLES //////*/
            @media only screen and (max-width: 620px) {
                
                /*////// GENERAL STYLES //////*/
                #foxeslab-email .table1 { width: 90% !important; margin-left: 5%; margin-right: 5%;}
                #foxeslab-email .table1-2 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
                #foxeslab-email .table1-3 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
                #foxeslab-email .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
                #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%;}
        
                #foxeslab-email .tablet_no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
                #foxeslab-email .tablet_wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }
        
                #foxeslab-email .tablet_hide { display: none !important; }
        
                #foxeslab-email .image1 { width: 100% !important; }
                #foxeslab-email .image1-290 { width: 100% !important; max-width: 290px !important; }
        
                .center_content{ text-align: center !important; }
                .center_button{ width: 50% !important;margin-left: 25% !important;max-width: 250px !important; }
                .logobackground{background: #555;}
            }
        
        
            /*////// MOBILE STYLES //////*/
            @media only screen and (max-width: 480px){
                /*////// CLIENT-SPECIFIC STYLES //////*/
                body{width:100% !important; min-width:100% !important;} /* Force iOS Mail to render the email at full width. */
                table[class="flexibleContainer"]{ width: 100% !important; }/* to prevent Yahoo Mail from rendering media query styles on desktop */
        
                /*////// GENERAL STYLES //////*/
                img[class="flexibleImage"]{height:50 !important; width:50% !important;}
        
                #foxeslab-email .table1 { width: 98% !important; }
                #foxeslab-email .no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
                #foxeslab-email .wise_float {	clear: both;	float: none !important;	width: auto !important;	margin: 0 auto !important;	text-align: center !important;	}
        
                #foxeslab-email .mobile_hide { display: none !important; }
        
            }
        </style>
        </head>
        <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">
        <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image"  width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
            <tr>
                <td>
                    <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">
                        <tr><td height="30"></td></tr>
                        <tr>
                            <td>
                                <!-- Logo -->
                                <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>
                                            <a href="#" class="editable-img">
                                                <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />
                                            </a>
                                        </td>
                                    </tr>
                                    <tr><td height="20"></td></tr>
        
                                </table><!-- END logo -->
                                
                            </td>
                        </tr>
                        <tr bgcolor="#fff">
                            <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">
                                <div class="editable-text" style="font-weight: bold;">
                                    <span class="text_container">Dear `+name+`,</span><br /><br />
                                </div>
                                
                                <div class="editable-text" style="line-height: 170%; text-align: justify; font-size: 18px; ">
                                    <span class="text_container" style="font-size: 13px;letter-spacing: 1px;word-spacing: 2px;">
                                        You have successfully credited your IC Asset Managers Investment account with <b>`+amount+` GHS</b>.<br />
                                         Details of the transaction are: <br/>
                                        Transaction Date: 	<b>`+date+`</b>	 <br/>
                                        Transaction Amount: <b>`+amount+` GHS</b><br/>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        
                            <tr>
                                <td style="padding-top: 10px; font-family: 'open sans', sans-serif; " align="center">
                                    <p style="color:#737f8d;text-align:'center' ">
                                        <small >
                                            <span >You're receiving this email because you made a transaction with your account</span><br />
                                            <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />
                                            <span >P.M.B 104, GP Accra - Ghana</span>
                                        </small>
                                    </p>
                                </td>
                            </tr>
                            <tr><td height="20"></td></tr>
                            <hr />
                            <tr>
                                <td mc:edit="text031" align="center" class="text_color_c2c2c2" style="color: #737f8d; font-size: 13px;line-height: 2; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                    <div class="editable-text" style="line-height: 2;">
                                        <span class="text_container">
                                            IC Asset Managers (Ghana) Limited is licensed and authorised to operate as a Fund Manager and Investment Advisor by the Securities and Exchange Commission (SEC) and as a Pension Fund Manager by the National Pension Regulation Authority.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        
                    </table>
                </td>
            </tr>
        </table><!-- END wrapper -->
        
        </table>
        </body>
        </html>`
 }

 var welcomeEmailTemplate = function(name){
     return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml">
     
     <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0" />
         <title>Welcome | Email Template</title>
     <style>
     /* ----------- */
     /* -- Reset -- */
     /* ----------- */
     body {
         margin: 0;
         padding: 0;
         mso-padding-alt: 0;
         mso-margin-top-alt: 0;
         width: 100% !important;
         height: 100% !important;
         mso-margin-bottom-alt: 0;
         /*background-color: #f0f0f0;*/
     }
     
     body, table, td, p, a, li, blockquote {
         -ms-text-size-adjust: 100%;
         -webkit-text-size-adjust: 100%;
     }
     
     table { border-spacing: 0; }
     table, td {
         mso-table-lspace: 0pt !important;
         mso-table-rspace: 0pt !important;
     }
     
     img, a img {
         border: 0;
         outline: none;
         text-decoration: none;  
     }
     img { -ms-interpolation-mode: bicubic; }
     
     p, h1, h2, h3, h4, h5, h6 {
         margin: 0;
         padding: 0;
     }
     
     .ReadMsgBody { width: 100%; }
     .ExternalClass { width: 100%; }
     .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
         line-height: 100%;
     }
     
     #outlook a { padding: 0; }
     
     img{
         max-width: 100%;
         height: auto;
     }
     
     /* ---------------- */
     /* -- Responsive -- */
     /* ---------------- */
     @media only screen and (max-width: 620px) {
         .shrink_font{
             font-size: 60px;
             margin-bottom: 20px;
         }
         #foxeslab-email .table1 { width: 92% !important; }
         #foxeslab-email .table1-2 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
         #foxeslab-email .table1-3 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
         #foxeslab-email .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
         #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%;}
     
         #foxeslab-email .tablet_no_float {
             clear: both;
             width: 100% !important;
             margin: 0 auto !important;
             text-align: center !important;
         }
          #foxeslab-email .tablet_wise_float {
             clear: both;
             float: none !important;
             width: auto !important;
             margin: 0 auto !important;
             text-align: center !important;
          }
     
         #foxeslab-email .tablet_hide { display: none !important; }
     
         #foxeslab-email .image1 { width: 100% !important; }
         #foxeslab-email .image1-290 {
             width: 100% !important;
             max-width: 290px !important;
         }
     
         .center_content{
             text-align: center !important;
         }
         .center_button{
             width: 50% !important;
             margin-left: 25% !important;
             max-width: 300px !important;
         }
     }
     
     
     @media only screen and (max-width: 479px) {
         #foxeslab-email .table1 { width: 98% !important; }
         #foxeslab-email .no_float {
             clear: both;
             width: 100% !important;
             margin: 0 auto !important;
             text-align: center !important;
         }
          #foxeslab-email .wise_float {
             clear: both;
             float: none !important;
             width: auto !important;
             margin: 0 auto !important;
             text-align: center !important;
          }
     
         #foxeslab-email .mobile_hide { display: none !important; }
     
     }
     
     @media (max-width: 480px){
         .container_400{
             width: 95%;
         }
     }
     </style>
     </head>
     <body style="padding: 0;margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">
     <!-- section-1 "navbar" -->
     <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image" bgcolor="#f6f6f6" width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
         <tr>
             <td>
                 <table class="table1" width="620" align="center" border="0" cellspacing="0" cellpadding="0" >
                     <tr><td height="30"></td></tr>
                     <tr>
                         <td>
     
                                 <!-- Logo -->
                                 <table class="no_float" width="138" align="center" border="0" cellspacing="0" cellpadding="0">
                                     <tr>
                                         <td>
                                             <a href="#" class="editable-img">
                                                 <img src="data:image/png;base64,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"  alt="Logo" width="180" height="75">
                                                 
                                             </a>
                                         </td>
                                     </tr>
                                     <tr><td height="10"></td></tr>
                                 </table><!-- END logo -->
                         </td>
                     </tr>
                 </table>
                 <table class="table1" width="620" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;" bgcolor="#fff">
                     <!-- padding-top -->
                     <tr><td height="30"></td></tr>
     
                     <!-- heading -->
                     <tr>
                         <td mc:edit="text015" align="center" class="text_color_282828" style="color: #282828; font-size: 24px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly;">
                             <div class="editable-text">
                                 <span class="text_container">
                                     <multiline>Welcome `+name+`</multiline>
                                 </span>
                             </div>
                         </td>
                     </tr>
     
                     <tr><td height="30"></td></tr>
                 </table>
                 <table class="table1" width="620" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;" bgcolor="#fff">
                     <tr>
                             <td mc:edit="text016" align="center" class="text_color_c2c2c2" style="color: #282828; font-size: 16px;line-height: 2; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                 <div class="editable-text" style="line-height: 2;">
                                     <span class="text_container">
                                         <multiline>
                                         Grow your investments effortlessly and securely with IC Asset Managers. Invest smarter and in less time! 
                                         </multiline>
                                     </span>
                                 </div>
                             </td>
                     </tr>
                     <tr><td height="20"></td></tr>
                     <tr>
                         <td mc:edit="text015" align="center" class="text_color_282828" style="color: #282828; font-size: 24px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly;">
                             <div class="editable-text">
                                 <span class="text_container">
                                     <multiline>Ready?</multiline>
                                 </span>
                             </div>
                         </td>
                     </tr>
                     <tr><td height="30"></td></tr>
                 </table>
                 
                         </td>
                     </tr>
     
                     
                 </table><!-- END container -->
     <table class="table_full editable-bg-color bg_color_363b44 editable-bg-image" bgcolor="#f6f6f6" width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0"  style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
         <tr>
             <td>
                 <table class="table1" width="620" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;" bgcolor="#14416b">
                     <!-- padding-top -->
                     <tr><td height="60"></td></tr>
                     
                     <tr>
                         <td>
                             <!-- column-1  -->
                             <table class="table1-2" width="370" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <tr>
                                     <td mc:edit="text031" align="center" class="text_color_ffffff" style="color: #ffffff; font-size: 16px; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                         <div class="editable-text">
                                             <span class="text_container">
                                                 <multiline>Start investing</multiline>
                                             </span>
                                         </div>
                                     </td>
                                 </tr>
                                 <!-- margin-bottom -->
                                 <tr><td height="30"></td></tr>
                             </table><!-- END column-1 -->
     
                             <!-- vertical gap -->
                             <table class="tablet_hide" width="3" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <tr><td height="1"></td></tr>
                             </table>
     
                             <!-- column-2  -->
                             <table class="table1-2" width="124" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <tr>
                                     <td>
                                         <table class="button_bg_color_ffffff bg_color_ffffff center_button" bgcolor="#fe8c00" width="90" height="35" align="left" border="0" cellpadding="0" cellspacing="0" style="background-color:#fe8c00; border:1px solid #fe8c00; border-radius:5px;">
                                             <tr>
                                                 <td mc:edit="text032"  class="text_color_363b44" align="center" valign="middle" style="color: #363b44; font-size: 12px; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                                     <div class="editable-text">
                                                         <span class="text_container">
                                                             <multiline>
                                                                 <a href="#" class="text_color_363b44" style="text-decoration: none; color: #fff;">Now</a>
                                                             </multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                                 <!-- margin-bottom -->
                                 <tr><td height="30"></td></tr>
                             </table><!-- END column-2 -->
                         </td>
                     </tr>
     
                     <!-- padding-top -->
                     <tr><td height="30"></td></tr>
                 </table><!-- END container -->
             </td>
         </tr>
     </table><!-- END wrapper -->
             </td>
         </tr>
     </table><!-- END wrapper -->
     
     
     <!-- section-3 "features"-->
     <table class="table_full editable-bg-color bg_color_363b44 editable-bg-image" bgcolor="#f6f6f6" width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0"  style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
         <tr>
             <td>
                 <table class="table1" width="620" align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;" bgcolor="#fff">	
                     <tr>
                         <td>
                             <!-- column-1  -->
                             <table class="table1-3 editable-bg-color bg_color_363b44" bgcolor="#ffffff" width="200" height="200" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <!-- padding-top -->
                                 <tr><td height="50"></td></tr>
                                 <tr>
                                     <td>
                                         <table width="200" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                             <tr>
                                                 <td mc:edit="text009" align="left" class="text_color_ffffff" style="color: #000; font-size: 14px; font-weight: 700; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly; padding-left: 13px; ">
                                                     <div class="editable-text">
                                                         <span class="text_container">
                                                             <multiline>DIVERSIFIED PORTFOLIO</multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
     
                                             <!-- horizontal gap -->
                                             <tr><td height="10"></td></tr>
     
                                             <tr>
                                                 <td mc:edit="text010" align="left" class="text_color_ffffff" style="color: #000; font-size: 16px;line-height: 1.5; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;  padding-left: 13px;">
                                                     <div class="editable-text" style="line-height: 1.5;">
                                                         <span class="text_container">
                                                         <multiline>
                                                             We build a robust, diversified portfolio that spreads your risks across different investments.
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                                 <!-- padding-bottom -->
                                 <tr><td height="50"></td></tr>
                             </table><!-- END column-1 -->
     
                             <!-- column-2  -->
                             <table class="table1-3 editable-bg-color bg_color_4628a1" bgcolor="#14416b" width="200" height="200" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <!-- padding-top -->
                                 <tr><td height="50"></td></tr>
                                 <tr>
                                     <td>
                                         <table width="200" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                             <tr>
                                                 <td mc:edit="text011" align="left" class="text_color_ffffff" style="color: #ffffff; font-size: 14px; font-weight: 700; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly; padding-left: 13px; padding-right: 10px">
                                                     <div class="editable-text">
                                                         <span class="text_container">
                                                             <multiline>HIGH QUALITY, LOW COST</multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
     
                                             <!-- horizontal gap -->
                                             <tr><td height="10"></td></tr>
     
                                             <tr>
                                                 <td mc:edit="text012" align="left" class="text_color_ffffff" style="color: #ffffff; font-size: 16px;line-height: 1.5; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;  padding-left: 13px; padding-right: 10px;">
                                                     <div class="editable-text" style="line-height: 1.5;">
                                                         <span class="text_container">
                                                             <multiline>We strip out unnecessary cost without compromising on quality.</multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                                 <!-- padding-bottom -->
                                 <tr><td height="50"></td></tr>
                             </table><!-- END column-2 -->
     
                             <!-- column-3  -->
                             <table class="table1-3 editable-bg-color bg_color_363b44" bgcolor="#ffffff" width="200" height="200" align="left" border="0" cellspacing="0" cellpadding="0">
                                 <!-- padding-top -->
                                 <tr><td height="50"></td></tr>
                                 <tr>
                                     <td>
                                         <table width="200" align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                             <tr>
                                                 <td mc:edit="text013" align="left" class="text_color_ffffff" style="color: #000; font-size: 14px; font-weight: 700; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly; padding-left: 13px;">
                                                     <div class="editable-text">
                                                         <span class="text_container">
                                                             <multiline>EXPERT MANAGEMENT</multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
     
                                             <!-- horizontal gap -->
                                             <tr><td height="10"></td></tr>
     
                                             <tr>
                                                 <td mc:edit="text014" align="left" class="text_color_ffffff" style="color: #000; font-size: 16px;line-height: 1.5; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                                     <div class="editable-text" style="line-height: 1.5; padding-left: 13px;">
                                                         <span class="text_container">
                                                             <multiline>
                                                                 Our experienced team constantly monitors and rebalances your portfolio to keep it on track, so you don't have to.
                                                             </multiline>
                                                         </span>
                                                     </div>
                                                 </td>
                                             </tr>
                                         </table>
                                     </td>
                                 </tr>
                                 <!-- padding-bottom -->
                                 <tr><td height="50"></td></tr>
                             </table><!-- END column-3 -->
                             <table class="table1-2" width="400" align="left" border="0" cellspacing="0" cellpadding="0" style="padding: 8px;">
                                     <tr>
                                         <td mc:edit="text016" align="left" class="text_color_c2c2c2" style="color: #282828; font-size: 20px;line-height: 2; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                             <div class="editable-text" style="line-height: 2;">
                                                 <span class="text_container">
                                                     <multiline>
                                                             Thank you <br />
                                                             <b>IC Asset Managers Team</b>
                                                     </multiline>
                                                 </span>
                                             </div>
                                         </td>
                                     </tr>
                             </table>
                         </td>
                     </tr>
                 </table><!-- END container -->
             </td>
         </tr>
     </table><!-- END wrapper -->
     
     
     </body>`;
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
                                            <a href="#" class="editable-img">
                                                <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />
                                            </a>
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
                                                            <a href="`+baseUrl+`/#/confirm/`+uuid+`" style="color: #fff">GO TO APPROVE</a>
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

 var debitEmailTemplate = function(name, amount, date, bank, account_name, account_number){
     return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml">
     <head>
         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
         <meta name="viewport" content="width=device-width"/>
         <title>HRCF | Withdrawal</title>
     <style type="text/css">
         /*////// RESET STYLES //////*/
         body{height:100% !important; margin:0; padding:0; width:100% !important;}
         table{border-collapse:separate;}
         img, a img{border:0; outline:none; text-decoration:none;}
         h1, h2, h3, h4, h5, h6{margin:0; padding:0;}
         p{margin: 1em 0;}
     
         /*////// CLIENT-SPECIFIC STYLES //////*/
         .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}
         .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%;}
         table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}
         #outlook a{padding:0;}
         img{-ms-interpolation-mode: bicubic;}
         body, table, td, p, a, li, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;}
             
         /*////// GENERAL STYLES //////*/
         img{ max-width: 100%; height: auto; }
         
         /*////// TABLET STYLES //////*/
         @media only screen and (max-width: 620px) {
             
             /*////// GENERAL STYLES //////*/
             #foxeslab-email .table1 { width: 90% !important; margin-left: 5%; margin-right: 5%;}
             #foxeslab-email .table1-2 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
             #foxeslab-email .table1-3 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
             #foxeslab-email .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%;}
             #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%;}
     
             #foxeslab-email .tablet_no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
             #foxeslab-email .tablet_wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }
     
             #foxeslab-email .tablet_hide { display: none !important; }
     
             #foxeslab-email .image1 { width: 100% !important; }
             #foxeslab-email .image1-290 { width: 100% !important; max-width: 290px !important; }
     
             .center_content{ text-align: center !important; }
             .center_button{ width: 50% !important;margin-left: 25% !important;max-width: 250px !important; }
             .logobackground{background: #555;}
         }
     
     
         /*////// MOBILE STYLES //////*/
         @media only screen and (max-width: 480px){
             /*////// CLIENT-SPECIFIC STYLES //////*/
             body{width:100% !important; min-width:100% !important;} /* Force iOS Mail to render the email at full width. */
             table[class="flexibleContainer"]{ width: 100% !important; }/* to prevent Yahoo Mail from rendering media query styles on desktop */
     
             /*////// GENERAL STYLES //////*/
             img[class="flexibleImage"]{height:50 !important; width:50% !important;}
     
             #foxeslab-email .table1 { width: 98% !important; }
             #foxeslab-email .no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }
             #foxeslab-email .wise_float {	clear: both;	float: none !important;	width: auto !important;	margin: 0 auto !important;	text-align: center !important;	}
     
             #foxeslab-email .mobile_hide { display: none !important; }
     
         }
     </style>
     </head>
     <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">
     <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image"  width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
         <tr>
             <td>
                 <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">
                     <tr><td height="30"></td></tr>
                     <tr>
                         <td>
                             <!-- Logo -->
                             <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">
                                 <tr>
                                     <td>
                                         <a href="#" class="editable-img">
                                             <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />
                                         </a>
                                     </td>
                                 </tr>
                                 <tr><td height="20"></td></tr>
     
                             </table><!-- END logo -->
                             
                         </td>
                     </tr>
                     <tr bgcolor="#fff">
                         <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">
                             <div class="editable-text" style="font-weight: bold;">
                                 <span class="text_container">Dear `+name+`,</span><br /><br />
                             </div>
                             
                             <div class="editable-text" style="line-height: 170%; text-align: justify; font-size: 18px; ">
                                 <span class="text_container" style="font-size: 13px;letter-spacing: 1px;word-spacing: 2px;">
                                     You have successfully withdrawn <b>`+amount+` GHS</b> from your IC Asset Managers Investment account.<br />
                                      Details of the transaction are: <br/>
                                     Transaction Date: 	<b>`+date+`</b>	 <br/>
                                     Transaction Amount: <b>`+amount+` GHS</b><br/>
                                     Bank name: 			<b>`+bank+`</b><br />
                                     Account name:  		<b>`+account_name+`</b> <br/>
                                     Account number:    	<b>`+account_number+`</b>
                                 </span>
                             </div>
                         </td>
                     </tr>
                     
                         <tr>
                             <td style="padding-top: 10px; font-family: 'open sans', sans-serif; " align="center">
                                 <p style="color:#737f8d;text-align:'center' ">
                                     <small >
                                         <span >You're receiving this email because you made a transaction with your account</span><br />
                                         <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />
                                         <span >P.M.B 104, GP Accra - Ghana</span>
                                     </small>
                                 </p>
                             </td>
                         </tr>
                         <tr><td height="20"></td></tr>
                         <hr />
                         <tr>
                             <td mc:edit="text031" align="center" class="text_color_c2c2c2" style="color: #737f8d; font-size: 13px;line-height: 2; font-weight: 400; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                 <div class="editable-text" style="line-height: 2;">
                                     <span class="text_container">
                                         IC Asset Managers (Ghana) Limited is licensed and authorised to operate as a Fund Manager and Investment Advisor by the Securities and Exchange Commission (SEC) and as a Pension Fund Manager by the National Pension Regulation Authority.
                                     </span>
                                 </div>
                             </td>
                         </tr>
                     
                 </table>
             </td>
         </tr>
     </table><!-- END wrapper --> 
     
     </table>
     </body>
     </html>`
 }


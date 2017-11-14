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
     return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml">
     
     <head>
         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
         <meta name="viewport" content="width=device-width" />
         <title>HRCF | Welcome</title>
         <style type="text/css">
         /*////// RESET STYLES //////*/
     
         body {
             height: 100% !important;
             margin: 0;
             padding: 0;
             width: 100% !important;
             
         }
     
         table {
             border-collapse: separate;
         }
     
         img,
         a img {
             border: 0;
             outline: none;
             text-decoration: none;
         }
     
         h1,
         h2,
         h3,
         h4,
         h5,
         h6 {
             margin: 0;
             padding: 0;
         }
     
         p {
             margin: 0;
         }
         /*////// CLIENT-SPECIFIC STYLES //////*/
     
         .ReadMsgBody {
             width: 100%;
         }
     
         .ExternalClass {
             width: 100%;
         }
     
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass span,
         .ExternalClass font,
         .ExternalClass td,
         .ExternalClass div {
             line-height: 100%;
         }
     
         table,
         td {
             mso-table-lspace: 0pt;
             mso-table-rspace: 0pt;
         }
     
         #outlook a {
             padding: 0;
         }
     
         img {
             -ms-interpolation-mode: bicubic;
         }
     
         body,
         table,
         td,
         p,
         a,
         li,
         blockquote {
             -ms-text-size-adjust: 100%;
             -webkit-text-size-adjust: 100%;
         }
         /*////// GENERAL STYLES //////*/
     
         img {
             max-width: 100%;
             height: auto;
         }
         /*////// TABLET STYLES //////*/
     
         @media only screen and (max-width: 620px) {
     
             /*////// GENERAL STYLES //////*/
             #foxeslab-email .table1 {
                 width: 90% !important;
                 margin-left: 5%;
                 margin-right: 5%;
             }
             #foxeslab-email .table1-2 {
                 width: 98% !important;
                 margin-left: 1%;
                 margin-right: 1%;
             }
             #foxeslab-email .table1-3 {
                 width: 98% !important;
                 margin-left: 1%;
                 margin-right: 1%;
             }
             #foxeslab-email .table1-4 {
                 width: 98% !important;
                 margin-left: 1%;
                 margin-right: 1%;
             }
             #foxeslab-email .table1-5 {
                 width: 90% !important;
                 margin-left: 5%;
                 margin-right: 5%;
             }
     
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
     
             #foxeslab-email .tablet_hide {
                 display: none !important;
             }
     
             #foxeslab-email .image1 {
                 width: 100% !important;
             }
             #foxeslab-email .image1-290 {
                 width: 100% !important;
                 max-width: 290px !important;
             }
     
             .center_content {
                 text-align: center !important;
             }
             .center_button {
                 width: 50% !important;
                 margin-left: 25% !important;
                 max-width: 250px !important;
             }
         }
         /*////// MOBILE STYLES //////*/
     
         @media only screen and (max-width: 480px) {
             /*////// CLIENT-SPECIFIC STYLES //////*/
             body {
                 width: 100% !important;
                 min-width: 100% !important;
             }
             /* Force iOS Mail to render the email at full width. */
             table[class="flexibleContainer"] {
                 width: 100% !important;
             }
             /* to prevent Yahoo Mail from rendering media query styles on desktop */
             /*////// GENERAL STYLES //////*/
             img[class="flexibleImage"] {
                 height: auto !important;
                 width: 100% !important;
             }
     
             #foxeslab-email .table1 {
                 width: 98% !important;
             }
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
     
             #foxeslab-email .mobile_hide {
                 display: none !important;
             }
         }
         </style>
     </head>
     
     <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">
         <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image" width="100%" align="center" mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">
             <tr>
                 <td>
                     <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">
                         <tr>
                             <td height="30"></td>
                         </tr>
                         <tr>
                             <td>
                                 <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">
                                     <tr>
                                         <td>
                                             <a href="#" class="editable-img">
                                             <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />
                                         </a>
                                         </td>
                                     </tr>
                                     <tr>
                                         <td height="20"></td>
                                     </tr>
                                 </table>
                             </td>
                         </tr>
                         <!-- END logo -->
                         <tr bgcolor="#fff">
                             <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">
                                 <div class="editable-text" style="font-weight: bold; text-align: center;">
                                     <span class="text_container ">Welcome  `+name+`,</span>
                                     <br />
                                     <br />
                                 </div>
                                 <div class="editable-text" style="font-weight: 200; text-align: justify; line-height: 150%;">
                                     Grow your investments effortlessly and securely with IC Asset Managers. Invest smarter and in less time!
                                     <br />
                                     <span><p style="text-align: center; font-weight: bold;" >Ready?</p></span>
                                 </div>
                                 <div class="editable-text" style="font-weight: 200; text-align: center; line-height: 150%;">
                                     Start investing <span>
                                                     <div bgcolor="#fe8c00" style="display: inline; background-color: #fe8c00; padding:5px 15px ; margin-left: 2%; border-radius: 5px; background-size: 20px 20px;">
                                                         
                                                             <a href="#" class="text_color_ffffff" style="text-decoration: none; color: #fff;"  >Now</a>
                                                         
                                                     </div>
                                                 </span>
                                 </div>
                                 <br />
                                 <div>
                                     <table style="display: inline;">
                                         <tr>
                                             <td>
                                                 <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid; height: 228px ">
                                                     <tr>
                                                         
                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                                             <div class="editable-text" style="line-height: 2; margin-top:-31px;">
                                                                 <span class="text_container">
                                                                     <h3 href="#" class="text_color_ffffff" style="color: #737f8d; text-decoration: none; text-align: center;">DIVERSIFIED PORTFOLIO</h3>
                                                                 <div style="">
                                                                     <p style="font-size: 14px; font-weight: 200; color: #737f8d; text-align: left; padding-left: 4%">
                                                                         We build a robust, diversified portfolio that spreads your risks across different investments.
                                                                     </p>
                                                                 </div>
                                                             </span>
                                                             </div>
                                                         </td>
                                                     </tr>
                                                 </table>
                                                 <!-- END column-1 -->
                                                  <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid; height: 228px">
                                                     <tr>
                                                         
                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                                             <div class="editable-text" style="line-height: 2; margin-top:-55px;">
                                                                 <span class="text_container">
                                                                     <h3 href="#" class="text_color_ffffff" style="color:#737f8d; text-decoration: none; text-align: center;">HIGH QUALITY, LOW COST</h3>
                                                                 <div style="">
                                                                     <p style="font-size: 14px; font-weight: 200; color:#737f8d; text-align: left; padding-left: 4%">
                                                                         We strip out unnecessary cost without compromising on quality.
                                                                     </p>
                                                                 </div>
                                                             </span>
                                                             </div>
                                                         </td>
                                                     </tr>
                                                 </table>
                                                 <!-- END column-2 -->
                                                  <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid;">
                                                     <tr>
                                                         
                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: 'Open Sans', Helvetica, sans-serif; mso-line-height-rule: exactly;">
                                                             <div class="editable-text" style="line-height: 2; margin-top:15px">
                                                                 <span class="text_container">
                                                                     <h3 href="#" class="text_color_ffffff" style="color: #737f8d; text-decoration: none; text-align: center;">EXPERT MANAGEMENT</h3>
                                                                 <div style="">
                                                                     <p style="font-size: 14px; font-weight: 200; color: #737f8d; text-align: left; padding-left: 4%">
                                                                         Our experienced investment team constantly monitors and rebalances your portfolio to keep it on track, so you don't have to.
                                                                     </p>
                                                                 </div>
                                                             </span>
                                                             </div>
                                                         </td>
                                                     </tr>
                                                 </table>
                                                 <!-- END column-3 -->
                                             </td>
                                         </tr>
                                     </table>
                                     
                                     
                                 </div>
                                 <br />
                                <div class="editable-text" style="font-weight: 200; text-align: justify; line-height: 130%;">
                                     Thank you <br />
                                     <b>IC Asset Managers Team</b>
                                    
                                 </div>
                             </td>
                         </tr>
                     </table>
                 </td>
             </tr>
         </table>
     </body>
     
     </html>`;
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


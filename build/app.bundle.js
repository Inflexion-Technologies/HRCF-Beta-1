/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ = __webpack_require__(4);

exports.getHash = function (password) {
    var crypto = __webpack_require__(28);
    var secret = 'thequickfoxjumpedoverthelazydog';
    var hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
    return hash;
};

exports.isValidEmail = function (email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};

exports.isValidMSISDN = function (msisdn) {
    if (msisdn.length === 10) {
        var tmpText = _.toArray(msisdn);
        var result = _.map(tmpText, function (it) {
            if (!(_.toUpper(it) === _.toLower(it))) {
                console.log('Text contains alphabets');
                return false;
            }
        });

        return !_.includes(result, false);
    } else {
        return false;
    }
};

exports.xlsxToJSON = function (filename) {

    var parseXlsx = __webpack_require__(29);

    parseXlsx('./uploads/ecobank.xlsx', function (err, data) {
        if (err) throw err;

        console.log(JSON.stringify(data));
        return data;
    });
};

exports.sendEmail = function (sender, title, message) {
    var config = __webpack_require__(2).config;
    var smtpTransport = __webpack_require__(11);
    var nodemailer = __webpack_require__(12);

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: config.email_host,

        auth: {
            user: config.email_username, // generated ethereal user
            pass: config.email_password // generated ethereal password
        }
    }));

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"HRCF Confirmation" <noreply@icassetmanagers.com>', // sender address
        to: sender, // list of receivers
        subject: title, // Subject line
        text: message // plain text body
        //html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};

exports.saveID = function (req, res) {
    var models = __webpack_require__(7);
    var sequelize = __webpack_require__(2).sequelize;
    var usersModel = models.usersModel(sequelize);
    var imageMapModel = models.imageMapModel(sequelize);

    var imgFilename = '';
    var fs = __webpack_require__(13);
    var multer = __webpack_require__(14);
    var storage = multer.diskStorage({
        destination: function destination(req, file, callback) {
            var path = __webpack_require__(5);
            var dest = path.resolve('./uploads');
            fs.ensureDirSync(dest);
            callback(null, dest);
        },
        filename: function filename(req, file, callback) {
            imgFilename = Date.now() + '.jpg';
            callback(null, imgFilename);
        }
    });
    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 256 * 1024 * 1024
        },
        fileFilter: function fileFilter(req, file, cb) {
            cb(null, true);
        }
    }).single('file');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end('Error');
        } else {
            if (req.file && req.body) {
                console.log(req.file);
                console.log(req.body);
                var user_id = req.body.user_id;

                imageMapModel.findOne({ where: { user_id: user_id, status: 'A' } }).then(function (mapper) {
                    if (mapper) {
                        mapper.update({ filename: imgFilename });
                    } else {
                        imageMapModel.create({ user_id: req.body.user_id, filename: imgFilename });
                    }
                    res.status(200).json({ success: true });
                });
            } else {
                res.end('Unsuccessful Upload');
            }
        }
    });
};

exports.capitalizeWord = function (name) {
    var _ = __webpack_require__(4);

    var value = _.capitalize(name);

    if (value.includes('-')) {
        var tokens = value.split('-');
        var newName = '';
        tokens.map(function (tmpName) {
            newName = newName + _.capitalize(tmpName.trim()) + '-';
        });

        value = newName.substr(0, newName.length - 1);
    }

    if (value.includes(' ')) {
        var tokens = value.split(' ');
        var newName = '';
        tokens.map(function (tmpName) {
            newName = newName + _.capitalize(tmpName.trim()) + ' ';
        });

        value = newName.trim();
    }

    return value;
};

exports.saveFile = function (req, res) {
    var models = __webpack_require__(7);
    var sequelize = __webpack_require__(2).sequelize;
    var usersModel = models.usersModel(sequelize);

    var fs = __webpack_require__(13);
    var multer = __webpack_require__(14);
    var storage = multer.diskStorage({
        destination: function destination(req, file, callback) {
            var path = __webpack_require__(5);
            var dest = path.resolve('./uploads');
            fs.ensureDirSync(dest);
            callback(null, dest);
        },
        filename: function filename(req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + '.xlsx');
        }
    });
    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 256 * 1024 * 1024
        },
        fileFilter: function fileFilter(req, file, cb) {
            cb(null, true);
        }
    }).single('file');

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end('Error');
        } else {
            if (req.file && req.body) {
                console.log(req.file);
                console.log(req.body);

                var ic_bank_id = req.body.bank_id;

                usersModel.findOne({ where: { id: req.body.user_id, is_admin: 'Y', status: 'A' } }).then(function (user) {
                    if (user) {
                        // var parseXlsx = require('excel');

                        // parseXlsx(req.file.path, function(err, data) {
                        //     if(err) throw err;
                        //     compute(req, res, data, ic_bank_id);
                        // });


                        var xlsx = __webpack_require__(30);
                        var workbook = xlsx.readFile(req.file.path);
                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        var data = xlsx.utils.sheet_to_json(worksheet);

                        console.log('sheet => ' + JSON.stringify(data));

                        compute2(req, res, data, ic_bank_id);
                    } else {
                        res.status(400).json({ success: false });
                    }
                });
            } else {
                res.end('Unsuccessful Upload');
            }
        }
    });
};

exports.sendApprovalEmail = function (name, email, uuid, code) {
    var config = __webpack_require__(2).config;

    var baseUrl = config.IP + ':' + config.PORT;
    sendEmail(email, 'Approve Request', approveEmailTemplate(baseUrl, code, name, uuid));
};

var sendEmail = function sendEmail(sender, title, message) {
    var config = __webpack_require__(2).config;
    var smtpTransport = __webpack_require__(11);
    var nodemailer = __webpack_require__(12);

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: config.email_host,

        auth: {
            user: config.email_username, // generated ethereal user
            pass: config.email_password // generated ethereal password
        }
    }));

    // setup email data with unicode symbols
    var mailOptions = {
        from: '"HRCF" <noreply@icassetmanagers.com>', // sender address
        to: sender, // list of receivers
        subject: title, // Subject line
        html: message // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};

exports.sendDebitMail = function (email, name, amount, date, bank, account_name, account_number) {
    var msg = debitEmailTemplate(name, amount, date, bank, account_name, account_number);
    sendEmail(email, 'Debit', msg);
};

exports.sendWelcomeMail = function (email, name) {
    var msg = welcomeEmailTemplate(name);
    sendEmail(email, 'Welcome', msg);
};

exports.sendCreditMail = function (email, name, amount, date) {
    var msg = creditEmailTemplate(name, amount, date);
    sendEmail(email, 'Credit', msg);
};

exports.getUniqCollection = function (data, field) {
    var _ = __webpack_require__(4);

    var allValues = [];

    data.map(function (d) {
        return allValues.push(d[field]);
    });

    var uniqFields = _.uniq(allValues);

    var filteredData = [];

    uniqFields.map(function (d) {
        var found = data.find(function (ld) {
            return ld[field] === d;
        });
        if (found) {
            filteredData.push(found);
        }
    });

    return filteredData;
};

var sendCreditMail2 = function sendCreditMail2(email, name, amount, date) {
    var msg = creditEmailTemplate(name, amount, date);
    sendEmail(email, 'Credit', msg);
};

var compute2 = function compute2(req, res, data, ic_bank_id) {
    if (data) {
        var _ = __webpack_require__(4);

        //Import Models
        var models = __webpack_require__(7);
        var sequelize = __webpack_require__(2).sequelize;

        var creditModel = models.creditModel(sequelize);
        var transactionModel = models.transactionModel(sequelize);
        var usersModel = models.usersModel(sequelize);
        var bankStatementModel = models.bankStatementModel(sequelize);
        var icBanksModel = models.ICBankModel(sequelize);

        if (data) {

            console.log('header passed');
            //Prepare objects for transactions
            var transactionMap = [];

            data.map(function (obj, i) {
                transactionMap.push({ date: obj.date, account_number: obj.bank_account, ledger_account: obj.ledger_account, credit: getNumber(obj.credit), debit: getNumber(obj.debit), description: obj.description, client_code: obj.client_code, fund_code: obj.fund_code, currency: obj.currency, security_issuer_code: obj.security_issuer_code, counter_party_code: obj.counter_party_code, sponsor_code: obj.sponsor_code });
            });

            console.log('Transaction statement length => ' + transactionMap.length + ', Transaction => ' + JSON.stringify(transactionMap));

            var HRCFData = _.filter(transactionMap, function (statement) {
                return statement.client_code.trim().length === 11;
            });

            console.log('HRCF length => ' + HRCFData.length);

            if (HRCFData) {
                var HRCFDataWithUserIds = [];

                HRCFData.map(function (data) {
                    usersModel.findOne({ where: { payment_number: data.client_code }, individualHooks: true }).then(function (user) {
                        if (user) {
                            var credit = data.credit.trim();
                            return user.increment({ 'actual_balance': parseFloat(credit) }).then(function (user) {
                                user.increment({ 'available_balance': parseFloat(credit) });

                                var newBalance = user.available_balance;
                                //Send an email
                                sendCreditMail2(user.email, user.firstname, credit, data.date);
                                return user;
                            });
                        }
                    }).then(function (user) {
                        if (user) {
                            icBanksModel.findOne({ where: { account_number: data.account_number, status: 'A' } }).then(function (icBank) {
                                if (icBank) {
                                    creditModel.create({ amount: data.credit, type: 'C', narration: data.description, user_id: user.id, bank_id: icBank.id });
                                    transactionModel.create({ amount: data.credit, type: 'C', narration: data.description, user_id: user.id });
                                }
                            });
                        }
                    });
                });
            }

            res.status(200).json({ success: true });

            //Create Bank Statement
            transactionMap.map(function (data, i) {
                return bankStatementModel.create({ ledger_account: data.ledger_account,
                    credit: data.credit,
                    debit: data.debit,
                    date: data.date,
                    description: data.description,
                    fund_code: data.fund_code,
                    client_code: data.client_code,
                    security_issuer_code: data.security_issuer_code,
                    currency: data.currency,
                    account_number: data.account_number,
                    ic_bank_id: ic_bank_id,
                    counter_party_code: data.counter_party_code,
                    sponsor_code: data.sponsor_code
                });
            });
        } else {
            console.log('Wrong fields ...');
        }
    }
};

var getNumber = function getNumber(value) {
    if (value.includes(',')) {
        var valueTokens = value.split(',');
        var newValue = '';

        valueTokens.map(function (token) {
            newValue = newValue + token;
        });

        return newValue;
    }

    return value;
};

var registeringEmailTemplate = function registeringEmailTemplate(name) {

    return '<html>\n       <head>\n       \n           <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />\n           <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />\n           <meta name="format-detection" content="telephone=no" />\n             <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />\n           <title>HRCF</title>\n           <style type="text/css">\n               \n               /* ==> Importing Fonts <== */\n               @import url(https://fonts.googleapis.com/css?family=Fredoka+One);\n               @import url(https://fonts.googleapis.com/css?family=Quicksand);\n               @import url(https://fonts.googleapis.com/css?family=Open+Sans);\n       \n               /* ==> Global CSS <== */\n               .ReadMsgBody{width:100%;background-color:#ffffff;}\n               .ExternalClass{width:100%;background-color:#ffffff;}\n               .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}\n               html{width: 100%;}\n               body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;}\n               table{border-spacing:0;border-collapse:collapse;}\n               table td{border-collapse:collapse;}\n               img{display:block !important;}\n               a{text-decoration:none;color:#e91e63;}\n       \n               /* ==> Responsive CSS For Tablets <== */\n               @media only screen and (max-width:640px) {\n                   body{width:auto !important;}\n                   table[class="tab-1"] {width:450px !important;}\n                   table[class="tab-2"] {width:47% !important;text-align:left !important;}\n                   table[class="tab-3"] {width:100% !important;text-align:center !important;}\n                   img[class="img-1"] {width:100% !important;height:auto !important;}\n               }\n       \n               /* ==> Responsive CSS For Phones <== */\n               @media only screen and (max-width:480px) {\n                   body { width: auto !important; }\n                   table[class="tab-1"] {width:290px !important;}\n                   table[class="tab-2"] {width:100% !important;text-align:left !important;}\n                   table[class="tab-3"] {width:100% !important;text-align:center !important;}\n                   img[class="img-1"] {width:100% !important;}\n               }\n       \n           </style>\n       </head>\n       <body bgcolor="#f6f6f6">\n           <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">\n               <tr >\n                   <td align="center">\n                       <table class="tab-1" align="center" cellspacing="0" cellpadding="0" width="600">\n       \n                           <tr><td height="60"></td></tr>\n                           <!-- Logo -->\n                           <tr>\n                                       <td align="center">\n                                           <img src="img/01-logo.png" alt="Logo" width="87">\n                                       </td>\n       \n                           </tr>\n       \n                           <tr><td height="35"></td></tr>\n       \n                           <tr>\n                               <td>\n       \n                                   <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >\n                                       <tr >\n                                           <td align="left" style="font-family: \'open Sans\', sans-serif; font-weight: bold; letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 40px; padding-right: 40px">\n                                               Hey' + name + ',\n                                           </td>\n                                       </tr>\n                                       <tr><td height="10"></td></tr>\n                                       <tr>\n       \n                                           <td align="left" style="color: #737f8d; font-family: \'open sans\',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px">\n                                               Thanks for registering for an account on HRCF! Before we get started, we just need to confirm that this is you. Click below to verify your email address:\n                                           </td>\n                                       </tr>\n                                       <tr>\n                                           <td style="padding-bottom: 50px; padding-left: 40px; padding-right: 40px" >\n                                               <table align="center" bgcolor="#0d47a1" >\n                                                   <tr >\n                                                       <td align="center" style="font-family: \'open sans\', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 15px 25px;">\n                                                           <a href="#" style="color: #fff">VERIFY</a>\n                                                       </td>\n                                                   </tr>\n                                               </table>\n                                           </td>\n                                       </tr>\n                                   </table>\n                                   <tr>\n                                           <td style="padding-top: 10px; font-family: \'open sans\', sans-serif; " align="center">\n                                               <p style="color:#737f8d;text-align:\'center\' ">\n                                                   <small >\n                                                       <span >You\'re receiving this email because you signed up for and account on HRCF</span><br />\n                                                       <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />\n                                                       <span >P.M.B 104, GP Accra - Ghana</span>\n                                                   </small>\n                                               </p>\n                                           </td>\n                                       </tr>\n       \n                                   \n                                   \n                               </td>\n                           </tr>\n       \n                           <tr><td height="60"></td></tr>\n       \n                       </table>\n                   </td>\n               </tr>\n           </table>\n        </body>\n       </html>';
};

var creditEmailTemplate = function creditEmailTemplate(name, amount, date) {

    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n        <html xmlns="http://www.w3.org/1999/xhtml">\n        <head>\n            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n            <meta name="viewport" content="width=device-width"/>\n            <title>HRCF | Credit</title>\n        <style type="text/css">\n            /*////// RESET STYLES //////*/\n            body{height:100% !important; margin:0; padding:0; width:100% !important;}\n            table{border-collapse:separate;}\n            img, a img{border:0; outline:none; text-decoration:none;}\n            h1, h2, h3, h4, h5, h6{margin:0; padding:0;}\n            p{margin: 1em 0;}\n        \n            /*////// CLIENT-SPECIFIC STYLES //////*/\n            .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}\n            .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%;}\n            table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}\n            #outlook a{padding:0;}\n            img{-ms-interpolation-mode: bicubic;}\n            body, table, td, p, a, li, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;}\n                \n            /*////// GENERAL STYLES //////*/\n            img{ max-width: 100%; height: auto; }\n            \n            /*////// TABLET STYLES //////*/\n            @media only screen and (max-width: 620px) {\n                \n                /*////// GENERAL STYLES //////*/\n                #foxeslab-email .table1 { width: 90% !important; margin-left: 5%; margin-right: 5%;}\n                #foxeslab-email .table1-2 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n                #foxeslab-email .table1-3 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n                #foxeslab-email .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n                #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%;}\n        \n                #foxeslab-email .tablet_no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }\n                #foxeslab-email .tablet_wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }\n        \n                #foxeslab-email .tablet_hide { display: none !important; }\n        \n                #foxeslab-email .image1 { width: 100% !important; }\n                #foxeslab-email .image1-290 { width: 100% !important; max-width: 290px !important; }\n        \n                .center_content{ text-align: center !important; }\n                .center_button{ width: 50% !important;margin-left: 25% !important;max-width: 250px !important; }\n                .logobackground{background: #555;}\n            }\n        \n        \n            /*////// MOBILE STYLES //////*/\n            @media only screen and (max-width: 480px){\n                /*////// CLIENT-SPECIFIC STYLES //////*/\n                body{width:100% !important; min-width:100% !important;} /* Force iOS Mail to render the email at full width. */\n                table[class="flexibleContainer"]{ width: 100% !important; }/* to prevent Yahoo Mail from rendering media query styles on desktop */\n        \n                /*////// GENERAL STYLES //////*/\n                img[class="flexibleImage"]{height:50 !important; width:50% !important;}\n        \n                #foxeslab-email .table1 { width: 98% !important; }\n                #foxeslab-email .no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }\n                #foxeslab-email .wise_float {\tclear: both;\tfloat: none !important;\twidth: auto !important;\tmargin: 0 auto !important;\ttext-align: center !important;\t}\n        \n                #foxeslab-email .mobile_hide { display: none !important; }\n        \n            }\n        </style>\n        </head>\n        <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">\n        <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image"  width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">\n            <tr>\n                <td>\n                    <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">\n                        <tr><td height="30"></td></tr>\n                        <tr>\n                            <td>\n                                <!-- Logo -->\n                                <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">\n                                    <tr>\n                                        <td>\n                                            <a href="#" class="editable-img">\n                                                <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />\n                                            </a>\n                                        </td>\n                                    </tr>\n                                    <tr><td height="20"></td></tr>\n        \n                                </table><!-- END logo -->\n                                \n                            </td>\n                        </tr>\n                        <tr bgcolor="#fff">\n                            <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">\n                                <div class="editable-text" style="font-weight: bold;">\n                                    <span class="text_container">Dear ' + name + ',</span><br /><br />\n                                </div>\n                                \n                                <div class="editable-text" style="line-height: 170%; text-align: justify; font-size: 18px; ">\n                                    <span class="text_container" style="font-size: 13px;letter-spacing: 1px;word-spacing: 2px;">\n                                        You have successfully credited your IC Asset Managers Investment account with <b>' + amount + ' GHS</b>.<br />\n                                         Details of the transaction are: <br/>\n                                        Transaction Date: \t<b>' + date + '</b>\t <br/>\n                                        Transaction Amount: <b>' + amount + ' GHS</b><br/>\n                                    </span>\n                                </div>\n                            </td>\n                        </tr>\n                        \n                            <tr>\n                                <td style="padding-top: 10px; font-family: \'open sans\', sans-serif; " align="center">\n                                    <p style="color:#737f8d;text-align:\'center\' ">\n                                        <small >\n                                            <span >You\'re receiving this email because you made a transaction with your account</span><br />\n                                            <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />\n                                            <span >P.M.B 104, GP Accra - Ghana</span>\n                                        </small>\n                                    </p>\n                                </td>\n                            </tr>\n                            <tr><td height="20"></td></tr>\n                            <hr />\n                            <tr>\n                                <td mc:edit="text031" align="center" class="text_color_c2c2c2" style="color: #737f8d; font-size: 13px;line-height: 2; font-weight: 400; font-family: \'Open Sans\', Helvetica, sans-serif; mso-line-height-rule: exactly;">\n                                    <div class="editable-text" style="line-height: 2;">\n                                        <span class="text_container">\n                                            IC Asset Managers (Ghana) Limited is licensed and authorised to operate as a Fund Manager and Investment Advisor by the Securities and Exchange Commission (SEC) and as a Pension Fund Manager by the National Pension Regulation Authority.\n                                        </span>\n                                    </div>\n                                </td>\n                            </tr>\n                        \n                    </table>\n                </td>\n            </tr>\n        </table><!-- END wrapper -->\n        \n        </table>\n        </body>\n        </html>';
};

var welcomeEmailTemplate = function welcomeEmailTemplate(name) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n     <html xmlns="http://www.w3.org/1999/xhtml">\n     \n     <head>\n         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n         <meta name="viewport" content="width=device-width" />\n         <title>HRCF | Welcome</title>\n         <style type="text/css">\n         /*////// RESET STYLES //////*/\n     \n         body {\n             height: 100% !important;\n             margin: 0;\n             padding: 0;\n             width: 100% !important;\n             \n         }\n     \n         table {\n             border-collapse: separate;\n         }\n     \n         img,\n         a img {\n             border: 0;\n             outline: none;\n             text-decoration: none;\n         }\n     \n         h1,\n         h2,\n         h3,\n         h4,\n         h5,\n         h6 {\n             margin: 0;\n             padding: 0;\n         }\n     \n         p {\n             margin: 0;\n         }\n         /*////// CLIENT-SPECIFIC STYLES //////*/\n     \n         .ReadMsgBody {\n             width: 100%;\n         }\n     \n         .ExternalClass {\n             width: 100%;\n         }\n     \n         .ExternalClass,\n         .ExternalClass p,\n         .ExternalClass span,\n         .ExternalClass font,\n         .ExternalClass td,\n         .ExternalClass div {\n             line-height: 100%;\n         }\n     \n         table,\n         td {\n             mso-table-lspace: 0pt;\n             mso-table-rspace: 0pt;\n         }\n     \n         #outlook a {\n             padding: 0;\n         }\n     \n         img {\n             -ms-interpolation-mode: bicubic;\n         }\n     \n         body,\n         table,\n         td,\n         p,\n         a,\n         li,\n         blockquote {\n             -ms-text-size-adjust: 100%;\n             -webkit-text-size-adjust: 100%;\n         }\n         /*////// GENERAL STYLES //////*/\n     \n         img {\n             max-width: 100%;\n             height: auto;\n         }\n         /*////// TABLET STYLES //////*/\n     \n         @media only screen and (max-width: 620px) {\n     \n             /*////// GENERAL STYLES //////*/\n             #foxeslab-email .table1 {\n                 width: 90% !important;\n                 margin-left: 5%;\n                 margin-right: 5%;\n             }\n             #foxeslab-email .table1-2 {\n                 width: 98% !important;\n                 margin-left: 1%;\n                 margin-right: 1%;\n             }\n             #foxeslab-email .table1-3 {\n                 width: 98% !important;\n                 margin-left: 1%;\n                 margin-right: 1%;\n             }\n             #foxeslab-email .table1-4 {\n                 width: 98% !important;\n                 margin-left: 1%;\n                 margin-right: 1%;\n             }\n             #foxeslab-email .table1-5 {\n                 width: 90% !important;\n                 margin-left: 5%;\n                 margin-right: 5%;\n             }\n     \n             #foxeslab-email .tablet_no_float {\n                 clear: both;\n                 width: 100% !important;\n                 margin: 0 auto !important;\n                 text-align: center !important;\n             }\n             #foxeslab-email .tablet_wise_float {\n                 clear: both;\n                 float: none !important;\n                 width: auto !important;\n                 margin: 0 auto !important;\n                 text-align: center !important;\n             }\n     \n             #foxeslab-email .tablet_hide {\n                 display: none !important;\n             }\n     \n             #foxeslab-email .image1 {\n                 width: 100% !important;\n             }\n             #foxeslab-email .image1-290 {\n                 width: 100% !important;\n                 max-width: 290px !important;\n             }\n     \n             .center_content {\n                 text-align: center !important;\n             }\n             .center_button {\n                 width: 50% !important;\n                 margin-left: 25% !important;\n                 max-width: 250px !important;\n             }\n         }\n         /*////// MOBILE STYLES //////*/\n     \n         @media only screen and (max-width: 480px) {\n             /*////// CLIENT-SPECIFIC STYLES //////*/\n             body {\n                 width: 100% !important;\n                 min-width: 100% !important;\n             }\n             /* Force iOS Mail to render the email at full width. */\n             table[class="flexibleContainer"] {\n                 width: 100% !important;\n             }\n             /* to prevent Yahoo Mail from rendering media query styles on desktop */\n             /*////// GENERAL STYLES //////*/\n             img[class="flexibleImage"] {\n                 height: auto !important;\n                 width: 100% !important;\n             }\n     \n             #foxeslab-email .table1 {\n                 width: 98% !important;\n             }\n             #foxeslab-email .no_float {\n                 clear: both;\n                 width: 100% !important;\n                 margin: 0 auto !important;\n                 text-align: center !important;\n             }\n             #foxeslab-email .wise_float {\n                 clear: both;\n                 float: none !important;\n                 width: auto !important;\n                 margin: 0 auto !important;\n                 text-align: center !important;\n             }\n     \n             #foxeslab-email .mobile_hide {\n                 display: none !important;\n             }\n         }\n         </style>\n     </head>\n     \n     <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">\n         <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image" width="100%" align="center" mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">\n             <tr>\n                 <td>\n                     <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">\n                         <tr>\n                             <td height="30"></td>\n                         </tr>\n                         <tr>\n                             <td>\n                                 <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">\n                                     <tr>\n                                         <td>\n                                             <a href="#" class="editable-img">\n                                             <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />\n                                         </a>\n                                         </td>\n                                     </tr>\n                                     <tr>\n                                         <td height="20"></td>\n                                     </tr>\n                                 </table>\n                             </td>\n                         </tr>\n                         <!-- END logo -->\n                         <tr bgcolor="#fff">\n                             <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">\n                                 <div class="editable-text" style="font-weight: bold; text-align: center;">\n                                     <span class="text_container ">Welcome  ' + name + ',</span>\n                                     <br />\n                                     <br />\n                                 </div>\n                                 <div class="editable-text" style="font-weight: 200; text-align: justify; line-height: 150%;">\n                                     Grow your investments effortlessly and securely with IC Asset Managers. Invest smarter and in less time!\n                                     <br />\n                                     <span><p style="text-align: center; font-weight: bold;" >Ready?</p></span>\n                                 </div>\n                                 <div class="editable-text" style="font-weight: 200; text-align: center; line-height: 150%;">\n                                     Start investing <span>\n                                                     <div bgcolor="#fe8c00" style="display: inline; background-color: #fe8c00; padding:5px 15px ; margin-left: 2%; border-radius: 5px; background-size: 20px 20px;">\n                                                         \n                                                             <a href="#" class="text_color_ffffff" style="text-decoration: none; color: #fff;"  >Now</a>\n                                                         \n                                                     </div>\n                                                 </span>\n                                 </div>\n                                 <br />\n                                 <div>\n                                     <table style="display: inline;">\n                                         <tr>\n                                             <td>\n                                                 <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid; height: 228px ">\n                                                     <tr>\n                                                         \n                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: \'Open Sans\', Helvetica, sans-serif; mso-line-height-rule: exactly;">\n                                                             <div class="editable-text" style="line-height: 2; margin-top:-31px;">\n                                                                 <span class="text_container">\n                                                                     <h3 href="#" class="text_color_ffffff" style="color: #737f8d; text-decoration: none; text-align: center;">DIVERSIFIED PORTFOLIO</h3>\n                                                                 <div style="">\n                                                                     <p style="font-size: 14px; font-weight: 200; color: #737f8d; text-align: left; padding-left: 4%">\n                                                                         We build a robust,\xA0diversified portfolio that\xA0spreads your risks across different investments.\n                                                                     </p>\n                                                                 </div>\n                                                             </span>\n                                                             </div>\n                                                         </td>\n                                                     </tr>\n                                                 </table>\n                                                 <!-- END column-1 -->\n                                                  <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid; height: 228px">\n                                                     <tr>\n                                                         \n                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: \'Open Sans\', Helvetica, sans-serif; mso-line-height-rule: exactly;">\n                                                             <div class="editable-text" style="line-height: 2; margin-top:-55px;">\n                                                                 <span class="text_container">\n                                                                     <h3 href="#" class="text_color_ffffff" style="color:#737f8d; text-decoration: none; text-align: center;">HIGH QUALITY, LOW COST</h3>\n                                                                 <div style="">\n                                                                     <p style="font-size: 14px; font-weight: 200; color:#737f8d; text-align: left; padding-left: 4%">\n                                                                         We strip out unnecessary cost without compromising on quality.\n                                                                     </p>\n                                                                 </div>\n                                                             </span>\n                                                             </div>\n                                                         </td>\n                                                     </tr>\n                                                 </table>\n                                                 <!-- END column-2 -->\n                                                  <table class="table1-3 editable-bg-color bg_color_53346d" *bgcolor="#14416b" width="216" align="left" border="0" cellspacing="0" cellpadding="0" style="border: 1px #14416b solid;">\n                                                     <tr>\n                                                         \n                                                         <td mc:edit="text038" align="center" class="text_color_ffffff" style="color: #737f8d;padding-top:10px;padding-right: 20px;padding-bottom: 20px; font-size: 12px;line-height: 2; font-weight: 600; font-family: \'Open Sans\', Helvetica, sans-serif; mso-line-height-rule: exactly;">\n                                                             <div class="editable-text" style="line-height: 2; margin-top:15px">\n                                                                 <span class="text_container">\n                                                                     <h3 href="#" class="text_color_ffffff" style="color: #737f8d; text-decoration: none; text-align: center;">EXPERT MANAGEMENT</h3>\n                                                                 <div style="">\n                                                                     <p style="font-size: 14px; font-weight: 200; color: #737f8d; text-align: left; padding-left: 4%">\n                                                                         Our experienced investment team constantly monitors and rebalances your portfolio to keep it on track, so you don\'t have to.\n                                                                     </p>\n                                                                 </div>\n                                                             </span>\n                                                             </div>\n                                                         </td>\n                                                     </tr>\n                                                 </table>\n                                                 <!-- END column-3 -->\n                                             </td>\n                                         </tr>\n                                     </table>\n                                     \n                                     \n                                 </div>\n                                 <br />\n                                <div class="editable-text" style="font-weight: 200; text-align: justify; line-height: 130%;">\n                                     Thank you <br />\n                                     <b>IC Asset Managers Team</b>\n                                    \n                                 </div>\n                             </td>\n                         </tr>\n                     </table>\n                 </td>\n             </tr>\n         </table>\n     </body>\n     \n     </html>';
};

var approveEmailTemplate = function approveEmailTemplate(baseUrl, code, name, uuid) {

    return '<html>\n        <head>\n        \n            <meta charset="utf-8" http-equiv="Content-Type" content="text/html" />\n            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />\n            <meta name="format-detection" content="telephone=no" />\n              <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />\n            <title>HRCF</title>\n            <style type="text/css">\n                \n                /* ==> Importing Fonts <== */\n                @import url(https://fonts.googleapis.com/css?family=Fredoka+One);\n                @import url(https://fonts.googleapis.com/css?family=Quicksand);\n                @import url(https://fonts.googleapis.com/css?family=Open+Sans);\n        \n                /* ==> Global CSS <== */\n                .ReadMsgBody{width:100%;background-color:#ffffff;}\n                .ExternalClass{width:100%;background-color:#ffffff;}\n                .ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%;}\n                html{width: 100%;}\n                body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;}\n                table{border-spacing:0;border-collapse:collapse;}\n                table td{border-collapse:collapse;}\n                img{display:block !important;}\n                a{text-decoration:none;color:#e91e63;}\n        \n                /* ==> Responsive CSS For Tablets <== */\n                @media only screen and (max-width:640px) {\n                    body{width:auto !important;}\n                    table[class="tab-1"] {width:450px !important;}\n                    table[class="tab-2"] {width:47% !important;text-align:left !important;}\n                    table[class="tab-3"] {width:100% !important;text-align:center !important;}\n                    img[class="img-1"] {width:100% !important;height:auto !important;}\n                }\n        \n                /* ==> Responsive CSS For Phones <== */\n                @media only screen and (max-width:480px) {\n                    body { width: auto !important; }\n                    table[class="tab-1"] {width:290px !important;}\n                    table[class="tab-2"] {width:100% !important;text-align:left !important;}\n                    table[class="tab-3"] {width:100% !important;text-align:center !important;}\n                    img[class="img-1"] {width:100% !important;}\n                }\n        \n            </style>\n        </head>\n        <body bgcolor="#f6f6f6">\n            <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0">\n                <tr >\n                    <td align="center">\n                        <table class="tab-1" align="center" cellspacing="0" cellpadding="0" width="600">\n        \n                            <tr><td height="60"></td></tr>\n                            <!-- Logo -->\n                            <tr>\n                                        <td align="center">\n                                            <a href="#" class="editable-img">\n                                                <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />\n                                            </a>\n                                        </td>\n        \n                            </tr>\n        \n                            <tr><td height="35"></td></tr>\n        \n                            <tr>\n                                <td>\n        \n                                    <table class="tab-3" width="600" align="left" cellspacing="0" cellpadding="0" bgcolor="#fff" >\n                                        <tr >\n                                            <td align="left" style="font-family: \'open Sans\', sans-serif;letter-spacing: 1px; color: #737f8d; font-size: 20px;padding-top: 50px; padding-left: 40px; padding-right: 40px">\n                                            Dear ' + name + ',\n                                            <br>\n                                            <br>\n                                            A cash withdrawal has been initiated on your investment account held with us\n                                            </td>\n                                        </tr>\n                                        <tr><td height="10"></td></tr>\n                                        <tr>\n        \n                                            <td align="left" style="color: #737f8d; font-family: \'open sans\',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px">\n                                            </td>\n                                        </tr>\n\n                                        <tr>\n                                            <td align="left" style="color: #737f8d; font-family: \'open sans\',sans-serif; font-weight: normal; font-size: 17px;padding-bottom: 50px; padding-left: 40px; padding-right: 40px;word-spacing: 3px;">\n                                                Your approval code: <span style="font-weight:600;font-size: 24px;letter-spacing: 1px">' + code + '</span>\n                                                <br>\n                                                <br>\n                                                Click below to authorize the transaction by entering your approval code, or reject transaction. <br/>\n                                                This code is required to complete the transaction.\n                                            </td>\n                                        </tr>\n\n                                        <tr>\n                                            <td style="padding-bottom: 50px; padding-left: 40px; padding-right: 40px" >\n                                                <table align="center" bgcolor="#0d47a1" >\n                                                    <tr >\n                                                        <td align="center" style="font-family: \'open sans\', sans-serif; font-weight: bold; letter-spacing: 2px; border: 1px solid #0d47a1; padding: 15px 25px;">\n                                                            <a href="' + baseUrl + '/#/confirm/' + uuid + '" style="color: #fff">GO TO APPROVE</a>\n                                                        </td>\n                                                    </tr>\n                                                </table>\n                                            </td>\n                                        </tr>\n                                    </table>\n                                    <tr>\n                                            <td style="padding-top: 10px; font-family: \'open sans\', sans-serif; " align="center">\n                                                <p style="color:#737f8d;text-align:\'center\' ">\n                                                    <small >\n                                                        <span >You\'re receiving this email because you signed up for and account on HRCF</span><br />\n                                                        <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />\n                                                        <span >P.M.B 104, GP Accra - Ghana</span>\n                                                    </small>\n                                                </p>\n                                            </td>\n                                        </tr>\n        \n                                    \n                                    \n                                </td>\n                            </tr>\n        \n                            <tr><td height="60"></td></tr>\n        \n                        </table>\n                    </td>\n                </tr>\n            </table>\n         </body>\n        </html>';
};

var debitEmailTemplate = function debitEmailTemplate(name, amount, date, bank, account_name, account_number) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n     <html xmlns="http://www.w3.org/1999/xhtml">\n     <head>\n         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n         <meta name="viewport" content="width=device-width"/>\n         <title>HRCF | Withdrawal</title>\n     <style type="text/css">\n         /*////// RESET STYLES //////*/\n         body{height:100% !important; margin:0; padding:0; width:100% !important;}\n         table{border-collapse:separate;}\n         img, a img{border:0; outline:none; text-decoration:none;}\n         h1, h2, h3, h4, h5, h6{margin:0; padding:0;}\n         p{margin: 1em 0;}\n     \n         /*////// CLIENT-SPECIFIC STYLES //////*/\n         .ReadMsgBody{width:100%;} .ExternalClass{width:100%;}\n         .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%;}\n         table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;}\n         #outlook a{padding:0;}\n         img{-ms-interpolation-mode: bicubic;}\n         body, table, td, p, a, li, blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;}\n             \n         /*////// GENERAL STYLES //////*/\n         img{ max-width: 100%; height: auto; }\n         \n         /*////// TABLET STYLES //////*/\n         @media only screen and (max-width: 620px) {\n             \n             /*////// GENERAL STYLES //////*/\n             #foxeslab-email .table1 { width: 90% !important; margin-left: 5%; margin-right: 5%;}\n             #foxeslab-email .table1-2 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n             #foxeslab-email .table1-3 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n             #foxeslab-email .table1-4 { width: 98% !important; margin-left: 1%; margin-right: 1%;}\n             #foxeslab-email .table1-5 { width: 90% !important; margin-left: 5%; margin-right: 5%;}\n     \n             #foxeslab-email .tablet_no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }\n             #foxeslab-email .tablet_wise_float { clear: both; float: none !important; width: auto !important; margin: 0 auto !important; text-align: center !important; }\n     \n             #foxeslab-email .tablet_hide { display: none !important; }\n     \n             #foxeslab-email .image1 { width: 100% !important; }\n             #foxeslab-email .image1-290 { width: 100% !important; max-width: 290px !important; }\n     \n             .center_content{ text-align: center !important; }\n             .center_button{ width: 50% !important;margin-left: 25% !important;max-width: 250px !important; }\n             .logobackground{background: #555;}\n         }\n     \n     \n         /*////// MOBILE STYLES //////*/\n         @media only screen and (max-width: 480px){\n             /*////// CLIENT-SPECIFIC STYLES //////*/\n             body{width:100% !important; min-width:100% !important;} /* Force iOS Mail to render the email at full width. */\n             table[class="flexibleContainer"]{ width: 100% !important; }/* to prevent Yahoo Mail from rendering media query styles on desktop */\n     \n             /*////// GENERAL STYLES //////*/\n             img[class="flexibleImage"]{height:50 !important; width:50% !important;}\n     \n             #foxeslab-email .table1 { width: 98% !important; }\n             #foxeslab-email .no_float { clear: both; width: 100% !important; margin: 0 auto !important; text-align: center !important; }\n             #foxeslab-email .wise_float {\tclear: both;\tfloat: none !important;\twidth: auto !important;\tmargin: 0 auto !important;\ttext-align: center !important;\t}\n     \n             #foxeslab-email .mobile_hide { display: none !important; }\n     \n         }\n     </style>\n     </head>\n     <body style="padding: 0; margin: 0;" id="foxeslab-email" bgcolor="#f6f6f6">\n     <table class="table_full editable-bg-color bg_color_ffffff editable-bg-image"  width="100%" align="center"  mc:repeatable="castellab" mc:variant="Header" cellspacing="0" cellpadding="0" border="0" style="background-image: url(#); background-position: top center; background-repeat: no-repeat; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" background="#">\n         <tr>\n             <td>\n                 <table class="table1" width="700" align="center" border="0" cellspacing="0" cellpadding="0">\n                     <tr><td height="30"></td></tr>\n                     <tr>\n                         <td>\n                             <!-- Logo -->\n                             <table class="tablet_no_float " width="138" align="center" border="0" cellspacing="0" cellpadding="0">\n                                 <tr>\n                                     <td>\n                                         <a href="#" class="editable-img">\n                                             <img editable="true" mc:edit="image001" src="http://icassetmanagers.com/images/asset-mgt.jpg" style="display:block; line-height:0; font-size:0; border:0; margin: 0 auto;" border="0" alt="image"  />\n                                         </a>\n                                     </td>\n                                 </tr>\n                                 <tr><td height="20"></td></tr>\n     \n                             </table><!-- END logo -->\n                             \n                         </td>\n                     </tr>\n                     <tr bgcolor="#fff">\n                         <td mc:edit="text030" align="left" class="text_color_282828" style="color: #737f8d; font-size: 20px; font-weight: 500; font-family: Raleway, Helvetica, sans-serif; mso-line-height-rule: exactly; padding: 20px;">\n                             <div class="editable-text" style="font-weight: bold;">\n                                 <span class="text_container">Dear ' + name + ',</span><br /><br />\n                             </div>\n                             \n                             <div class="editable-text" style="line-height: 170%; text-align: justify; font-size: 18px; ">\n                                 <span class="text_container" style="font-size: 13px;letter-spacing: 1px;word-spacing: 2px;">\n                                     You have successfully withdrawn <b>' + amount + ' GHS</b> from your IC Asset Managers Investment account.<br />\n                                      Details of the transaction are: <br/>\n                                     Transaction Date: \t<b>' + date + '</b>\t <br/>\n                                     Transaction Amount: <b>' + amount + ' GHS</b><br/>\n                                     Bank name: \t\t\t<b>' + bank + '</b><br />\n                                     Account name:  \t\t<b>' + account_name + '</b> <br/>\n                                     Account number:    \t<b>' + account_number + '</b>\n                                 </span>\n                             </div>\n                         </td>\n                     </tr>\n                     \n                         <tr>\n                             <td style="padding-top: 10px; font-family: \'open sans\', sans-serif; " align="center">\n                                 <p style="color:#737f8d;text-align:\'center\' ">\n                                     <small >\n                                         <span >You\'re receiving this email because you made a transaction with your account</span><br />\n                                         <span >The Victoria, Plot No. 131. North Labone, Accra-Ghana </span><br />\n                                         <span >P.M.B 104, GP Accra - Ghana</span>\n                                     </small>\n                                 </p>\n                             </td>\n                         </tr>\n                         <tr><td height="20"></td></tr>\n                         <hr />\n                         <tr>\n                             <td mc:edit="text031" align="center" class="text_color_c2c2c2" style="color: #737f8d; font-size: 13px;line-height: 2; font-weight: 400; font-family: \'Open Sans\', Helvetica, sans-serif; mso-line-height-rule: exactly;">\n                                 <div class="editable-text" style="line-height: 2;">\n                                     <span class="text_container">\n                                         IC Asset Managers (Ghana) Limited is licensed and authorised to operate as a Fund Manager and Investment Advisor by the Securities and Exchange Commission (SEC) and as a Pension Fund Manager by the National Pension Regulation Authority.\n                                     </span>\n                                 </div>\n                             </td>\n                         </tr>\n                     \n                 </table>\n             </td>\n         </tr>\n     </table><!-- END wrapper --> \n     \n     </table>\n     </body>\n     </html>';
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var Sequelize = __webpack_require__(10);
var path = __webpack_require__(5);

var config = {
    IP: process.env.SERVER_IP || 'http://104.155.93.65',
    PORT: process.env.SERVER_PORT || 8001,
    secret: 'thequickfoxjumpedofthelazydog',
    uploadlocation: path.resolve(__dirname + '/resources'),
    ext: 'xlsx',
    ams: 'http://217.174.240.226:8080/fam-rest/rest/api/eod?fundCode=ICAMGHRCF&valueDate=',
    cron_balance_time: 0,
    email_host: 'smtp.gmail.com',
    email_port: '587',
    email_secure: false,
    email_username: 'noreply@icassetmanagers.com',
    email_password: 'dqKZ%388',
    prepare: false
};

var sequelize = new Sequelize(process.env.DB_NAME || 'HRCF', process.env.DB_USER || 'hrcf', process.env.DB_PASSWORD || 'pa55w0rd', {
    host: process.env.DB_HOST || 'localhost',
    //dialect: 'postgres',
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
        max: 1,
        min: 0,
        idle: 10000,
        acquire: 20000,
        handleDisconnects: true
    }
});

module.exports = { config: config, sequelize: sequelize };
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("dateformat");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.companyModel = companyModel;
exports.transactionModel = transactionModel;
exports.withdrawalModel = withdrawalModel;
exports.creditModel = creditModel;
exports.bankModel = bankModel;
exports.idModel = idModel;
exports.imageMapModel = imageMapModel;
exports.bankStatementModel = bankStatementModel;
exports.ICBankModel = ICBankModel;
exports.branchModel = branchModel;
exports.accountModel = accountModel;
exports.requestModel = requestModel;
exports.payoutRequestModel = payoutRequestModel;
exports.trackModel = trackModel;
exports.navStoreModel = navStoreModel;
exports.approveModel = approveModel;
exports.usersModel = usersModel;

var _sequelize = __webpack_require__(10);

var _lodash = __webpack_require__(4);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = __webpack_require__(1);

function companyModel(config) {
  var company = config.define('company', {
    name: {
      type: _sequelize.Sequelize.STRING
    },
    location: {
      type: _sequelize.Sequelize.STRING
    },
    reg_number: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return company;
}

function transactionModel(config) {
  var transactions = config.define('transaction', {
    type: {
      type: _sequelize.Sequelize.ENUM,
      values: ['W', 'C', 'I']
    },
    amount: {
      type: _sequelize.Sequelize.DOUBLE,
      defaultValue: 0
    },
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    narration: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return transactions;
}

function withdrawalModel(config) {
  var withdrawals = config.define('withdrawal', {
    amount: {
      type: _sequelize.Sequelize.DOUBLE
    },
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    account_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return withdrawals;
}

function creditModel(config) {
  var credits = config.define('credit', {
    amount: {
      type: _sequelize.Sequelize.DOUBLE
    },
    type: {
      type: _sequelize.Sequelize.ENUM,
      values: ['C', 'I']
    },
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    bank_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    narration: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return credits;
}

function bankModel(config) {
  var banks = config.define('bank', {
    name: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('name', _lodash2.default.capitalize(val).trim());
      },
      get: function get() {
        var name = this.getDataValue('name');
        // 'this' allows you to access attributes of the instance

        var nameTokens = name.split(' ');
        if (nameTokens.length === 1) {
          return _lodash2.default.capitalize(nameTokens);
        } else {
          var tmpName = '';
          nameTokens.map(function (n) {
            tmpName = tmpName + _lodash2.default.capitalize(n) + ' ';
          });

          return tmpName.trim();
        }
      }
    },
    code: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return banks;
}

function idModel(config) {
  var ids = config.define('id_type', {
    name: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('name', _lodash2.default.capitalize(val).trim());
      }
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return ids;
}

function imageMapModel(config) {
  var mapper = config.define('id_map', {
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    filename: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return mapper;
}

function bankStatementModel(config) {
  var bankStatements = config.define('bank_statement', {
    ledger_account: {
      type: _sequelize.Sequelize.STRING
    },
    date: {
      type: _sequelize.Sequelize.DATE
    },
    ic_bank_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    credit: {
      type: _sequelize.Sequelize.DOUBLE
    },
    debit: {
      type: _sequelize.Sequelize.DOUBLE
    },
    fund_code: {
      type: _sequelize.Sequelize.STRING
    },
    client_code: {
      type: _sequelize.Sequelize.STRING
    },
    currency: {
      type: _sequelize.Sequelize.STRING
    },
    counter_party_code: {
      type: _sequelize.Sequelize.STRING
    },
    sponsor_code: {
      type: _sequelize.Sequelize.STRING
    },
    security_issuer_code: {
      type: _sequelize.Sequelize.STRING
    },
    account_number: {
      type: _sequelize.Sequelize.STRING
    },
    description: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return bankStatements;
}

function ICBankModel(config) {
  var icbanks = config.define('ic_bank', {
    name: {
      type: _sequelize.Sequelize.STRING

    },
    account_number: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('account_number', val.trim());
      }
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return icbanks;
}

function branchModel(config) {
  var bankBranch = config.define('bank_branch', {
    name: {
      type: _sequelize.Sequelize.STRING,
      get: function get() {
        var name = this.getDataValue('name');
        // 'this' allows you to access attributes of the instance

        var nameTokens = name.split(' ');
        if (nameTokens.length === 1) {
          return _lodash2.default.capitalize(nameTokens);
        } else {
          var tmpName = '';
          nameTokens.map(function (n) {
            tmpName = tmpName + _lodash2.default.capitalize(n) + ' ';
          });

          return tmpName.trim();
        }
      }
    },
    code: {
      type: _sequelize.Sequelize.STRING
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return bankBranch;
}

function accountModel(config) {
  var account = config.define('account', {
    name: {
      type: _sequelize.Sequelize.STRING
    },
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    account_number: {
      type: _sequelize.Sequelize.STRING
    },
    bank_branch_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return account;
}

function requestModel(config) {
  var request = config.define('approve_request', {
    uuid: {
      type: _sequelize.Sequelize.UUID,
      defaultValue: _sequelize.Sequelize.UUIDV1
    },
    transaction_code: {
      type: _sequelize.Sequelize.STRING
    },
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    amount: {
      type: _sequelize.Sequelize.INTEGER
    },
    approver_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    account_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'P'
    }
  }, { underscored: true });

  return request;
}

function payoutRequestModel(config) {
  var payout_request = config.define('payout_request', {
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    amount: {
      type: _sequelize.Sequelize.INTEGER
    },
    account_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    request_date: {
      type: _sequelize.Sequelize.DATE
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'P'
    }
  }, { underscored: true });

  return payout_request;
}

function trackModel(config) {
  var track = config.define('tracker', {
    count: {
      type: _sequelize.Sequelize.INTEGER
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return track;
}

function navStoreModel(config) {
  var nav = config.define('nav_store', {
    nav: {
      type: _sequelize.Sequelize.INTEGER
    },
    nav_per_unit: {
      type: _sequelize.Sequelize.INTEGER
    },
    gain_loss: {
      type: _sequelize.Sequelize.INTEGER
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return nav;
}

function approveModel(config) {
  var approvers = config.define('approver', {
    user_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    firstname: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('firstname', utils.capitalizeWord(val).trim());
      }
    },
    lastname: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        if (val !== undefined && val !== null) {
          this.setDataValue('lastname', utils.capitalizeWord(val).trim());
        } else {
          this.setDataValue('lastname', '');
        }
      }
    },
    email: {
      type: _sequelize.Sequelize.STRING,
      validate: {
        isEmail: true
      }, set: function set(val) {
        this.setDataValue('email', val.trim());
      }
    },
    msisdn: {
      type: _sequelize.Sequelize.STRING,
      validate: {
        isNumeric: true
      }, set: function set(val) {
        this.setDataValue('msisdn', val.trim());
      }
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return approvers;
}

function usersModel(config) {
  var users = config.define('user', {
    firstname: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('firstname', utils.capitalizeWord(val).trim());
      }
    },
    lastname: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        if (val !== undefined && val !== null) {
          this.setDataValue('lastname', utils.capitalizeWord(val).trim());
        } else {
          this.setDataValue('lastname', '');
        }
      }
    },
    payment_number: {
      type: _sequelize.Sequelize.STRING,
      unique: true
    },
    email: {
      type: _sequelize.Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }, set: function set(val) {
        this.setDataValue('email', val.trim());
      }
    },
    msisdn: {
      type: _sequelize.Sequelize.STRING,
      unique: true,
      validate: {
        isNumeric: true
      }, set: function set(val) {
        this.setDataValue('msisdn', val.trim());
      }
    },
    available_balance: {
      type: _sequelize.Sequelize.DOUBLE,
      defaultValue: 0
    },
    actual_balance: {
      type: _sequelize.Sequelize.DOUBLE,
      defaultValue: 0
    },
    type: {
      type: _sequelize.Sequelize.ENUM,
      values: ['C', 'I']
    },
    is_admin: {
      type: _sequelize.Sequelize.ENUM,
      values: ['Y', 'N'],
      defaultValue: ['N']
    },
    kin: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('kin', _lodash2.default.capitalize(val).trim());
      }
    },
    kin_msisdn: {
      type: _sequelize.Sequelize.STRING,
      validate: {
        isNumeric: true
      }, set: function set(val) {
        this.setDataValue('kin_msisdn', val.trim());
      }
    },
    password: {
      type: _sequelize.Sequelize.STRING,
      set: function set(val) {
        this.setDataValue('password', utils.getHash(val.trim()));
      }
    },
    id_type_id: {
      type: _sequelize.Sequelize.INTEGER
    },
    id_number: {
      type: _sequelize.Sequelize.STRING
    },
    is_complete: {
      type: _sequelize.Sequelize.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: _sequelize.Sequelize.STRING(1),
      defaultValue: 'A'
    }
  }, { underscored: true });

  return users;
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("nodemailer-smtp-transport");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("nodemailer");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("fs-extended");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _cookieParser = __webpack_require__(16);

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = __webpack_require__(9);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = __webpack_require__(17);

var _morgan2 = _interopRequireDefault(_morgan);

var _expressSession = __webpack_require__(18);

var _expressSession2 = _interopRequireDefault(_expressSession);

var _expressValidator = __webpack_require__(19);

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _users_router = __webpack_require__(20);

var _users_router2 = _interopRequireDefault(_users_router);

var _approves_router = __webpack_require__(21);

var _approves_router2 = _interopRequireDefault(_approves_router);

var _banks_router = __webpack_require__(22);

var _banks_router2 = _interopRequireDefault(_banks_router);

var _branches_router = __webpack_require__(23);

var _branches_router2 = _interopRequireDefault(_branches_router);

var _companys_router = __webpack_require__(24);

var _companys_router2 = _interopRequireDefault(_companys_router);

var _credits_router = __webpack_require__(25);

var _credits_router2 = _interopRequireDefault(_credits_router);

var _transactions_router = __webpack_require__(26);

var _transactions_router2 = _interopRequireDefault(_transactions_router);

var _withdrawals_router = __webpack_require__(31);

var _withdrawals_router2 = _interopRequireDefault(_withdrawals_router);

var _auth_router = __webpack_require__(32);

var _auth_router2 = _interopRequireDefault(_auth_router);

var _bank_statements_router = __webpack_require__(33);

var _bank_statements_router2 = _interopRequireDefault(_bank_statements_router);

var _misc_router = __webpack_require__(34);

var _misc_router2 = _interopRequireDefault(_misc_router);

var _accounts_router = __webpack_require__(35);

var _accounts_router2 = _interopRequireDefault(_accounts_router);

var _utils_router = __webpack_require__(36);

var _utils_router2 = _interopRequireDefault(_utils_router);

var _session_router = __webpack_require__(38);

var _session_router2 = _interopRequireDefault(_session_router);

var _uploads_router = __webpack_require__(39);

var _uploads_router2 = _interopRequireDefault(_uploads_router);

var _models = __webpack_require__(7);

var models = _interopRequireWildcard(_models);

var _config = __webpack_require__(2);

var d = _interopRequireWildcard(_config);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _jsonwebtoken = __webpack_require__(8);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.app = (0, _express2.default)();
        this.initExpress(this.app);
        this.initSQLAndRouters(this.app);
        this.finalize(this.app);
    }

    _createClass(App, [{
        key: 'initExpress',
        value: function initExpress(app) {
            app.use(_bodyParser2.default.json({ limit: '50mb', parameterLimit: 1000000 }));
            app.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
            app.use((0, _cookieParser2.default)());
            //app.use(expressValidator([]));
            app.use((0, _expressSession2.default)({ resave: true, saveUninitialized: true,
                secret: 'thequickbrownfoxjumpedoverthelazydogs',
                cookieName: 'session',
                duration: 30 * 60 * 1000,
                activeDuration: 5 * 60 * 1000,
                httpOnly: true,
                cookie: { secure: false } }));

            //CORS enabling
            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
                next();
            });

            //logging
            app.use((0, _morgan2.default)('dev'));

            app.use(_express2.default.static('build'));

            //Disable cache
            app.use(function (req, res, next) {
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                res.header('Expires', '-1');
                res.header('Pragma', 'no-cache');
                next();
            });

            app.get('/', function (req, res) {
                res.sendFile(_path2.default.join(__dirname, 'build', 'index.html'));
            });
        }
    }, {
        key: 'servePages',
        value: function servePages(req, res) {
            var app = (0, _express2.default)();

            res.sendFile('build/index.html', { root: __dirname });
        }
    }, {
        key: 'validate',
        value: function validate(req, res, next) {
            var app = (0, _express2.default)();

            //JSON Web Token Secret
            app.set('token', d.config.secret);

            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            // decode token
            if (token) {

                // verifies secret and checks exp
                _jsonwebtoken2.default.verify(token, app.get('token'), function (err, decoded) {
                    if (err) {
                        return res.json({ success: false, message: 'Failed to authenticate token.' });
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {

                // if there is no token
                // return an error
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }

            //next();
        }
    }, {
        key: 'initSQLAndRouters',
        value: function initSQLAndRouters(app) {
            var dbConfig = d.sequelize;

            //Setting up models
            var approveModel = models.approveModel(dbConfig);
            var bankModel = models.bankModel(dbConfig);
            var branchModel = models.branchModel(dbConfig);

            var companyModel = models.companyModel(dbConfig);
            var creditModel = models.creditModel(dbConfig);
            var transactionModel = models.transactionModel(dbConfig);
            var withdrawalModel = models.withdrawalModel(dbConfig);
            var usersModel = models.usersModel(dbConfig);
            var trackModel = models.trackModel(dbConfig);

            var icBankModel = models.ICBankModel(dbConfig);
            var bankStatementModel = models.bankStatementModel(dbConfig);
            var idTypesModel = models.idModel(dbConfig);
            var accountsModel = models.accountModel(dbConfig);
            var requestModel = models.requestModel(dbConfig);
            var imageMapperModel = models.imageMapModel(dbConfig);
            var payoutModel = models.payoutRequestModel(dbConfig);
            var navStoreModel = models.navStoreModel(dbConfig);

            //Setting relationships

            payoutModel.belongsTo(usersModel);
            payoutModel.belongsTo(accountsModel);

            imageMapperModel.belongsTo(usersModel);

            requestModel.belongsTo(usersModel);
            requestModel.belongsTo(approveModel);
            requestModel.belongsTo(accountsModel);

            bankStatementModel.belongsTo(icBankModel);

            approveModel.belongsTo(companyModel);

            branchModel.belongsTo(bankModel);

            usersModel.belongsTo(companyModel);

            creditModel.belongsTo(usersModel);
            creditModel.belongsTo(bankModel);

            transactionModel.belongsTo(usersModel);

            withdrawalModel.belongsTo(usersModel);
            withdrawalModel.belongsTo(bankModel);
            withdrawalModel.belongsTo(accountsModel);

            approveModel.belongsTo(usersModel);

            accountsModel.belongsTo(usersModel);
            accountsModel.belongsTo(branchModel);

            usersModel.belongsToMany(approveModel, { through: 'user_approvers' });
            approveModel.belongsToMany(usersModel, { through: 'user_approvers' });

            usersModel.belongsToMany(accountsModel, { through: 'user_accounts' });
            accountsModel.belongsToMany(usersModel, { through: 'user_accounts' });

            //Loading Banks and Branches and IC Banks
            var banksData = __webpack_require__(40);
            var branchesData = __webpack_require__(41);
            var icBanksData = __webpack_require__(42);
            var idTypesData = __webpack_require__(43);

            // dbConfig.sync().then(()=>{  
            if (d.config.prepare) {
                dbConfig.sync({ force: true }).then(function () {
                    trackModel.bulkCreate([{ count: 1 }, { count: 1 }]);
                    companyModel.bulkCreate([{ name: 'Anonymous' }]);
                    bankModel.bulkCreate(banksData);
                    branchModel.bulkCreate(branchesData);
                    icBankModel.bulkCreate(icBanksData);
                    idTypesModel.bulkCreate(idTypesData);
                });
            }

            var users = new _users_router2.default(usersModel, trackModel, companyModel);
            var approvers = new _approves_router2.default(approveModel);

            var branches = new _branches_router2.default(branchModel);
            var companys = new _companys_router2.default(companyModel, usersModel);
            var credits = new _credits_router2.default(creditModel, bankModel, usersModel);
            var transactions = new _transactions_router2.default(transactionModel, usersModel, requestModel, approveModel, creditModel);
            var withdrawals = new _withdrawals_router2.default(withdrawalModel, usersModel);
            var banks = new _banks_router2.default(bankModel);

            var utils = new _utils_router2.default(usersModel, trackModel, companyModel, bankModel, branchModel, idTypesModel, requestModel, accountsModel, approveModel, icBankModel, payoutModel, withdrawalModel, transactionModel);
            var auth = new _auth_router2.default(usersModel);
            var bankstatement = new _bank_statements_router2.default(bankStatementModel, icBankModel, usersModel);
            var misc = new _misc_router2.default(usersModel, accountsModel, approveModel, companyModel);
            var accounts = new _accounts_router2.default(accountsModel, branchModel, bankModel, usersModel);
            var uploadStatement = new _uploads_router2.default();

            //Set Middleware to check for sessions
            app.use('/api/v1/*', this.validate);

            app.use('/api/v1/users', users.routes());
            app.use('/api/v1/approvers', approvers.routes());
            app.use('/api/v1/branches', branches.routes());
            app.use('/api/v1/companys', companys.routes());
            app.use('/api/v1/credits', credits.routes());
            app.use('/api/v1/transactions', transactions.routes());
            app.use('/api/v1/withdrawals', withdrawals.routes());
            app.use('/api/v1/banks', banks.routes());
            app.use('/api/v1/ic/statements', bankstatement.routes());
            app.use('/api/v1/misc', misc.routes());
            app.use('/api/v1/accounts', accounts.routes());
            app.use('/api/v1/uploads', uploadStatement.routes());

            app.use('/api/utils', utils.routes());
            app.use('/api/auth', auth.routes());

            this.runCron();
        }
    }, {
        key: 'finalize',
        value: function finalize(app) {
            var PORT = d.config.PORT;
            app.listen(parseInt(PORT), function () {
                console.log('Running on PORT ::: ' + PORT);
            });
        }
    }, {
        key: 'creditAllUsers',
        value: function creditAllUsers(assume_nav) {
            var dbConfig = d.sequelize;
            var usersModel = models.usersModel(dbConfig);
            var creditModel = models.creditModel(dbConfig);
            var transaction = models.transactionModel(dbConfig);

            usersModel.sum('actual_balance', { where: { status: 'A' } }).then(function (totalActualBalance) {
                if (parseFloat(totalActualBalance) > 0) {
                    var nav = parseFloat(assume_nav) - parseFloat(totalActualBalance);
                    if (nav < 1) return;

                    usersModel.findAll({ where: { status: 'A' } }).then(function (users) {
                        users.map(function (user) {
                            var interest = parseFloat(user.actual_balance) / parseFloat(totalActualBalance) * parseFloat(nav);
                            user.increment({ 'actual_balance': interest });
                            user.increment({ 'available_balance': interest }).then(function (user) {
                                if (user) {
                                    creditModel.create({ amount: interest,
                                        type: 'I',
                                        user_id: user.id,
                                        narration: 'Interest' });
                                    transaction.create({ type: 'I',
                                        amount: interest,
                                        user_id: user.id,
                                        narration: 'Interest' });
                                }
                            });
                        });
                    });
                }
            });
        }
    }, {
        key: 'saveNAV',
        value: function saveNAV(payload) {
            var dbConfig = d.sequelize;
            var navStoreModel = models.navStoreModel(dbConfig);

            navStoreModel.create({ nav: payload.nav,
                nav_per_unit: payload.navPerUnit,
                gain_loss: payload.gainLoss });
        }
    }, {
        key: 'getNAV',
        value: function getNAV() {
            var app = this;
            var request = __webpack_require__(3),
                dateFormat = __webpack_require__(6),
                yesterday = new Date().setDate(new Date().getDate() - 1),
                yesterday_formatted = dateFormat(new Date(yesterday), 'dd-mm-yyyy'),
                url = d.config.ams;

            request({
                uri: url + yesterday_formatted,
                method: 'GET',
                json: true
            }, function (error, res, body) {
                app.creditAllUsers(body.payload.nav);
                app.saveNAV(body.payload);
            });
        }
    }, {
        key: 'runCron',
        value: function runCron() {
            var _this = this;

            setInterval(function () {
                var dateFormat = __webpack_require__(6);
                var hour = dateFormat(new Date(), 'H');

                if (parseInt(hour) === 0) {
                    _this.getNAV();
                }
            }, 60 * 60 * 1000);
        }
    }]);

    return App;
}();

exports.default = App;


var server = new App();
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("express-validator");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _dateformat = __webpack_require__(6);

var _dateformat2 = _interopRequireDefault(_dateformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserRoutes = function () {
    function UserRoutes(UsersModel, TracksModel, CompanyModel) {
        _classCallCheck(this, UserRoutes);

        this.UsersModel = UsersModel;
        this.TracksModel = TracksModel;
        this.CompanyModel = CompanyModel;
    }

    _createClass(UserRoutes, [{
        key: 'getGeneratedId',
        value: function getGeneratedId(count, type) {
            var now = new Date();
            var year = (0, _dateformat2.default)(now, "yy");
            var month = (0, _dateformat2.default)(now, "mm");

            //Bubble the zeros
            var id = '';
            switch ((count + '').length) {
                case 1:
                    {
                        id = '0000' + count;
                        break;
                    };
                case 2:
                    {
                        id = '000' + count;
                        break;
                    }
                case 3:
                    {
                        id = '00' + count;
                        break;
                    }
                case 4:
                    {
                        id = '0' + count;
                        break;
                    }
                case 5:
                    {
                        id = '' + count;
                    }

                default:
                    id = count;
            }

            console.log('H' + type + year + id + month);
            return 'H' + type + year + id + month;
        }
    }, {
        key: 'updateIndividualPaymentNumber',
        value: function updateIndividualPaymentNumber(user, res) {
            var app = this;

            if (user.type === 'I') {
                app.TracksModel.findById(1).then(function (track) {
                    var newCount = track.count + 1;
                    var paymentId = app.getGeneratedId(newCount, '01');

                    //Update count
                    app.TracksModel.update({ count: newCount }, { where: { id: 1 } }).then(function (track) {

                        //Update user
                        if (track) {
                            app.UsersModel.update({ payment_number: paymentId, company_id: 1 }, { where: { id: user.id } }).then(function (vuser) {
                                if (vuser) {
                                    app.UsersModel.findOne({ where: { id: user.id }, include: [app.CompanyModel] }).then(function (user) {
                                        res.status(200).json(user);
                                    });
                                } else {
                                    res.status(400).send('Could not update');
                                }
                            });
                        } else {

                            console.log('Something happened !');
                            res.status(400).send('Something went wrong');
                        }
                    });
                });
            }
        }
    }, {
        key: 'updateCompanyPaymentNumber',
        value: function updateCompanyPaymentNumber(user, res) {
            var app = this;

            if (user.type === 'C') {
                app.TracksModel.findById(2).then(function (track) {
                    var newCount = track.count + 1;
                    var paymentId = app.getGeneratedId(newCount, '00');

                    //Update count
                    app.TracksModel.update({ count: newCount }, { where: { id: 2 } }).then(function (track) {

                        if (track) {

                            //Save company
                            app.CompanyModel.create({ name: user.cname, location: user.lname }).then(function (company) {
                                if (company) {

                                    //Update user
                                    app.UsersModel.update({ payment_number: paymentId, company_id: company.id }, { where: { id: user.id } }).then(function (vuser) {
                                        if (vuser) {
                                            app.UsersModel.findOne({ where: { id: user.id }, include: [app.CompanyModel] }).then(function (user) {
                                                res.status(200).json(user);
                                            });
                                        } else {
                                            res.status(400).send('Could not update');
                                        }
                                    });
                                }
                            });
                        } else {

                            console.log('Something happened !');
                            res.status(400).send('Something went wrong');
                        }
                    });
                });
            }
        }
    }, {
        key: 'routes',
        value: function routes() {
            var app = this;
            var usersRouter = _express2.default.Router();

            usersRouter.route('/').get(function (req, res) {
                app.UsersModel.findAll({ where: { status: 'A' }, include: [app.CompanyModel], attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status'] }).then(function (users) {
                    users.map(function (user) {
                        delete user.password;
                    });

                    res.status(200).json(users);
                });
            });

            usersRouter.route('/:id').get(function (req, res) {
                app.UsersModel.findOne({ where: { id: req.params.id, status: 'A' }, include: [app.CompanyModel], attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status'] }).then(function (user) {
                    delete user.password;

                    res.status(200).json(user);
                });
            });

            usersRouter.route('/email/:email').get(function (req, res) {
                app.UsersModel.findOne({ where: { email: req.params.email, status: 'A' }, include: [app.CompanyModel], attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status'] }).then(function (user) {
                    delete user.password;

                    res.status(200).json(user);
                });
            });

            usersRouter.route('/').post(function (req, res) {

                if (Object.keys(req.body) != 0) {
                    app.UsersModel.create(req.body).then(function (user) {
                        if (user && req.body.type === 'C') {
                            user.lname = req.body.lname;
                            user.cname = req.body.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    });
                } else if (Object.keys(req.params) != 0) {
                    app.UsersModel.create(req.params).then(function (user) {
                        if (user && req.params.type === 'C') {
                            user.lname = req.params.lname;
                            user.cname = req.params.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    }).catch(function (error) {
                        if (error) res.status(400).send('Could not save data');
                    });
                } else {
                    console.log('Passed NONE !!!');
                }
            });

            // usersRouter.route('/:id')
            //     .delete((req, res)=>{

            //     });

            return usersRouter;
        }
    }]);

    return UserRoutes;
}();

exports.default = UserRoutes;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApproveRoutes = function () {
    function ApproveRoutes(ApproveModel) {
        _classCallCheck(this, ApproveRoutes);

        this.ApproveModel = ApproveModel;
    }

    _createClass(ApproveRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var approversRouter = _express2.default.Router();

            approversRouter.route('/').get(function (req, res) {
                app.ApproveModel.findAll().then(function (approvers) {
                    res.status(200).json(approvers);
                });
            });

            approversRouter.route('/:id').get(function (req, res) {
                // User.findById(req.params.id).then(user => {
                //     res.status(200).json(user);
                // })
            });

            approversRouter.route('/email/:email').get(function (req, res) {
                // User.findOne({ where : {email : req.params.email}}).then(user => {
                //  res.status(200).json(user);
                // })
            });

            approversRouter.route('/').post(function (req, res) {

                if (Object.keys(req.body) != 0) {
                    app.ApproveModel.create(req.body).then(function (approver) {
                        res.status(200).json(approver);
                    });
                } else if (Object.keys(req.params) != 0) {
                    app.ApproveModel.create(req.params).then(function (approver) {
                        res.status(200).json(approver);
                    });
                }
            });

            // approversRouter.route('/:id')
            //     .delete((req, res)=>{

            //     });

            return approversRouter;
        }
    }]);

    return ApproveRoutes;
}();

exports.default = ApproveRoutes;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BanksRoutes = function () {
    function BanksRoutes(Banks) {
        _classCallCheck(this, BanksRoutes);

        this.Banks = Banks;
    }

    _createClass(BanksRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var banksRouter = _express2.default.Router();

            banksRouter.route('/').get(function (req, res) {
                app.Banks.findAll({ where: { status: 'A' } }).then(function (banks) {
                    res.status(200).json(banks);
                });
            });

            banksRouter.route('/:id').get(function (req, res) {
                app.Banks.findById(req.params.id).then(function (bank) {
                    res.status(200).json(bank);
                });
            });

            banksRouter.route('/').post(function (req, res) {
                if (req.body) {
                    app.Banks.create(req.body).then(function (bank) {
                        res.status(200).json(bank);
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            banksRouter.route('/:id').delete(function (req, res) {
                app.Banks.update({ status: 'D' }, { where: { id: req.params.id } }).then(function (bank) {
                    res.status(200).json(bank);
                });
            });

            return banksRouter;
        }
    }]);

    return BanksRoutes;
}();

exports.default = BanksRoutes;
;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BranchesRoutes = function () {
    function BranchesRoutes(BranchModel) {
        _classCallCheck(this, BranchesRoutes);

        this.BranchModel = BranchModel;
    }

    _createClass(BranchesRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var branchesRouter = _express2.default.Router();

            branchesRouter.route('/').get(function (req, res) {
                app.BranchModel.findAll({ where: { status: 'A' } }).then(function (branches) {
                    res.status(200).json(branches);
                });
            });

            branchesRouter.route('/:id').get(function (req, res) {
                app.BranchModel.findById(req.params.id).then(function (branch) {
                    res.status(200).json(branch);
                });
            });

            branchesRouter.route('/').post(function (req, res) {
                if (req.body) {
                    app.BranchModel.create(req.body).then(function (branch) {
                        res.status(200).json(branch);
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            branchesRouter.route('/:id').delete(function (req, res) {
                app.BranchModel.update({ status: 'D' }, { where: { id: req.params.id } }).then(function (branch) {
                    res.status(200).json(branch);
                });
            });

            return branchesRouter;
        }
    }]);

    return BranchesRoutes;
}();

exports.default = BranchesRoutes;
;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompanysRoutes = function () {
    function CompanysRoutes(CompanyModel, UserModel) {
        _classCallCheck(this, CompanysRoutes);

        this.CompanyModel = CompanyModel;
        this.UserModel = UserModel;
    }

    _createClass(CompanysRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var companysRouter = _express2.default.Router();

            companysRouter.route('/').get(function (req, res) {
                app.CompanyModel.findAll({ where: { status: 'A' }, limit: 150, include: [app.UserModel] }).then(function (company) {
                    res.status(200).json(company);
                });
            });

            companysRouter.route('/:id').get(function (req, res) {
                app.CompanyModel.findById(req.params.id).then(function (company) {
                    res.status(200).json(company);
                });
            });

            companysRouter.route('/user_id/:user_id').get(function (req, res) {
                app.CompanyModel.findOne({ where: { user_id: req.params.user_id }, include: [app.UserModel] }).then(function (company) {
                    res.status(200).json(company);
                });
            });

            // companysRouter.route('/')
            //     .post((req, res)=>{
            //         if(req.body){
            //             app.CompanyModel.create(req.body).then((company)=>{
            //                 res.status(200).json(company);                                
            //             })
            //         }else{
            //             res.status(200).send('Data not saved!');
            //         }
            //     }); 

            // companysRouter.route('/:id')
            //     .delete((req, res)=>{

            //     });

            return companysRouter;
        }
    }]);

    return CompanysRoutes;
}();

exports.default = CompanysRoutes;
;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CreditsRoutes = function () {
    function CreditsRoutes(CreditModel, BankModel, UserModel) {
        _classCallCheck(this, CreditsRoutes);

        this.CreditModel = CreditModel;
        this.BankModel = BankModel;
        this.UserModel = UserModel;
    }

    _createClass(CreditsRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var creditsRouter = _express2.default.Router();

            creditsRouter.route('/').get(function (req, res) {
                app.CreditModel.findAll({ where: { status: 'A' }, limit: 150, include: [app.UserModel, app.BankModel] }).then(function (credits) {
                    res.status(200).json(credits);
                });
            });

            creditsRouter.route('/:id').get(function (req, res) {
                app.CreditModel.findById(req.params.id).then(function (credit) {
                    res.status(200).json(credit);
                });
            });

            creditsRouter.route('/user_id/:user_id').get(function (req, res) {
                app.CreditModel.findOne({ where: { user_id: req.params.user_id }, include: [app.UserModel, app.BankModel] }).then(function (credit) {
                    res.status(200).json(credit);
                });
            });

            // creditsRouter.route('/')
            //     .post((req, res)=>{
            //         if(req.body){
            //             app.CreditModel.create(req.body).then((credit)=>{
            //                 res.status(200).json(credit);                                
            //             })
            //         }else{
            //             res.status(200).send('Data not saved!');
            //         }
            //     }); 

            // creditsRouter.route('/:id')
            //     .delete((req, res)=>{

            //     });

            return creditsRouter;
        }
    }]);

    return CreditsRoutes;
}();

exports.default = CreditsRoutes;
;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _shortid = __webpack_require__(27);

var _shortid2 = _interopRequireDefault(_shortid);

var _lodash = __webpack_require__(4);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransactionsRoutes = function () {
    function TransactionsRoutes(TransactionModel, UserModel, RequestModel, ApproveModel, CreditModel) {
        _classCallCheck(this, TransactionsRoutes);

        this.TransactionModel = TransactionModel;
        this.UserModel = UserModel;
        this.RequestModel = RequestModel;
        this.ApproveModel = ApproveModel;
        this.CreditModel = CreditModel;
    }

    _createClass(TransactionsRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var transactionsRouter = _express2.default.Router();

            transactionsRouter.route('/').get(function (req, res) {
                app.TransactionModel.findAll({ where: { status: 'A' }, include: [{ model: app.UserModel, attributes: ['firstname', 'lastname', 'payment_number', 'email', 'msisdn'] }] }).then(function (transactions) {
                    res.status(200).json(transactions);
                });
            });

            transactionsRouter.route('/:id').get(function (req, res) {
                app.TransactionModel.findOne({ where: { id: req.params.id, status: 'A' }, include: [{ model: app.UserModel, attributes: ['firstname', 'lastname', 'payment_number', 'email', 'msisdn'] }] }).then(function (transaction) {
                    res.status(200).json(transaction);
                });
            });

            transactionsRouter.route('/user_id/:user_id').get(function (req, res) {
                app.TransactionModel.findOne({ where: { user_id: req.params.user_id }, include: [{ model: app.UserModel, attributes: ['firstname', 'lastname', 'payment_number', 'email', 'msisdn'] }] }).then(function (transaction) {
                    res.status(200).json(transaction);
                });
            });

            transactionsRouter.route('/balance/:user_id').get(function (req, res) {
                app.UserModel.findOne({ where: { id: req.params.user_id, status: 'A' }, attributes: ['id', 'available_balance', 'actual_balance'] }).then(function (user) {
                    if (user) {
                        res.status(200).json(user);
                    } else {
                        res.status(403).send('Nothing Found');
                    }
                });
            });

            transactionsRouter.route('/contributions/user/:user_id').get(function (req, res) {

                //Contributions First
                app.TransactionModel.sum('amount', { where: { type: 'C', status: 'A', user_id: req.params.user_id } }).then(function (credit) {
                    if (credit) {
                        var total_credits = credit;
                        app.TransactionModel.sum('amount', { where: { type: 'W', status: 'A', user_id: req.params.user_id } }).then(function (withdraw_amount) {
                            var total_contribution = total_credits - withdraw_amount;
                            res.status(200).json({ contribution: total_contribution });
                        });
                    } else {
                        res.status(200).json({ contribution: 0 });
                    }
                });
            });

            transactionsRouter.route('/interest/user/:id').get(function (req, res) {
                app.TransactionModel.sum('amount', { where: { user_id: req.params.id, type: 'I', status: 'A' } }).then(function (interest) {
                    if (interest) {
                        res.status(200).json({ interest: interest });
                    } else {
                        res.status(200).json({ interest: 0 });
                    }
                });
            });

            transactionsRouter.route('/history/user/:id').get(function (req, res) {

                //Find pending transactions
                app.RequestModel.findAll({ where: { user_id: req.params.id, status: 'P' }, order: [['id', 'DESC']] }).then(function (requests) {
                    if (requests) {
                        //Got some pending requests
                        app.TransactionModel.findAll({ where: { user_id: req.params.id }, order: [['id', 'DESC']] }).then(function (transactions) {
                            if (transactions) {
                                //Prepare a collection and send back
                                var collection = [];

                                var utils = __webpack_require__(1);
                                var uniqRequest = utils.getUniqCollection(requests, 'transaction_code');

                                uniqRequest.map(function (request) {
                                    return collection.push({ date: request.created_at,
                                        transaction: 'Withdraw',
                                        amount: request.amount,
                                        status: 'Pending' });
                                });

                                transactions.map(function (transaction) {
                                    collection.push({ date: transaction.created_at,
                                        transaction: transaction.narration,
                                        amount: transaction.amount,
                                        status: 'Successful' });
                                });

                                res.status(200).json(collection);
                            }
                        });
                    } else {
                        //Got no pending requests
                        app.TransactionModel.findAll({ where: { user_id: req.params.id }, order: [['id', 'DESC']] }).then(function (transactions) {
                            res.status(200).json(transactions);
                        });
                    }
                });
            });

            transactionsRouter.route('/').post(function (req, res) {
                if (req.body) {
                    app.TransactionModel.create(req.body).then(function (transaction) {
                        res.status(200).json(transaction);
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            transactionsRouter.route('/interest_chart/:user_id').get(function (req, res) {
                app.TransactionModel.findAll({ where: { id: req.params.user_id, type: 'I', status: 'A' } }).then(function (interests) {
                    res.status(200).json(interests);
                });
            });

            transactionsRouter.route('/request/:user_id').post(function (req, res) {
                if (req.body) {
                    var user_id = req.params.user_id;
                    var amount = req.body.detail.amount;
                    var account_id = req.body.detail.account_id;
                    var password = req.body.detail.password;
                    var transaction_code = _shortid2.default.generate();
                    var utils = __webpack_require__(1);

                    console.log('Amount => ' + amount + ', account => ' + account_id);

                    //Grab all approvers

                    //Verify User
                    app.UserModel.findOne({ where: { id: user_id, password: utils.getHash(password) } }).then(function (user) {
                        if (user) {
                            user.decrement({ 'available_balance': parseFloat(amount) }).then(function (user) {
                                console.log('Available balance Debited!');
                                app.placeRequest(res, user_id, amount, account_id, transaction_code);
                            });
                        } else {
                            res.status(400).json({ success: false });
                        }
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            transactionsRouter.route('/:id').delete(function (req, res) {});

            return transactionsRouter;
        }
    }, {
        key: 'placeRequest',
        value: function placeRequest(res, user_id, amount, account_id, transaction_code) {
            var app = this;

            app.ApproveModel.findAll({ where: { user_id: user_id, status: 'A' } }).then(function (approvers) {
                var counter = 0;
                approvers.map(function (approver) {
                    var approver_id = approver.id;
                    var approve_name = approver.firstname;
                    var email = approver.email;

                    return app.RequestModel.create({ transaction_code: transaction_code,
                        user_id: user_id,
                        amount: amount,
                        account_id: account_id,
                        approver_id: approver_id
                    }).then(function (request) {
                        var utils = __webpack_require__(1);
                        utils.sendApprovalEmail(approve_name, email, request.uuid, transaction_code);
                        counter = counter + 1;
                        if (counter === approvers.length) {
                            res.status(200).json({ success: true });
                        }
                    });
                });
            });
        }
    }]);

    return TransactionsRoutes;
}();

exports.default = TransactionsRoutes;
;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("shortid");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("excel");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("xlsx");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WithdrawalsRoutes = function () {
    function WithdrawalsRoutes(WithdrawalModel, UserModel) {
        _classCallCheck(this, WithdrawalsRoutes);

        this.WithdrawalModel = WithdrawalModel;
        this.UserModel = UserModel;
    }

    _createClass(WithdrawalsRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var withdrawalsRouter = _express2.default.Router();

            withdrawalsRouter.route('/').get(function (req, res) {
                app.WithdrawalModel.findAll({ where: { status: 'A' }, limit: 150, include: [app.UserModel] }).then(function (withdrawals) {
                    res.status(200).json(withdrawals);
                });
            });

            withdrawalsRouter.route('/:id').get(function (req, res) {
                app.WithdrawalModel.findById(req.params.id).then(function (withdrawal) {
                    res.status(200).json(withdrawal);
                });
            });

            withdrawalsRouter.route('/user_id/:user_id').get(function (req, res) {
                app.WithdrawalModel.findOne({ where: { user_id: req.params.user_id }, include: [app.UserModel] }).then(function (withdrawal) {
                    res.status(200).json(withdrawal);
                });
            });

            // withdrawalsRouter.route('/')
            //     .post((req, res)=>{
            //         if(req.body){
            //             app.WithdrawalModel.create(req.body).then((withdrawal)=>{
            //                 res.status(200).json(withdrawal);                                
            //             })
            //         }else{
            //             res.status(200).send('Data not saved!');
            //         }
            //     }); 

            // withdrawalsRouter.route('/:id')
            //     .delete((req, res)=>{

            //     });

            return withdrawalsRouter;
        }
    }]);

    return WithdrawalsRoutes;
}();

exports.default = WithdrawalsRoutes;
;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = __webpack_require__(8);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = __webpack_require__(2);

var d = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthRoutes = function () {
    function AuthRoutes(UserModel) {
        _classCallCheck(this, AuthRoutes);

        this.UserModel = UserModel;
    }

    _createClass(AuthRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var authRouter = _express2.default.Router();
            var utils = __webpack_require__(1);
            var expressApp = (0, _express2.default)();

            expressApp.set('token', d.config.secret);

            authRouter.route('/').get(function (req, res) {
                if (req.query) {
                    if (utils.isValidEmail(req.query.username.trim())) {
                        app.UserModel.findOne({ where: { email: req.query.username, password: utils.getHash(req.query.password) } }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                });
                            } else {
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        });
                    } else if (utils.isValidMSISDN(req.query.username.trim())) {
                        app.UserModel.findOne({ where: { email: req.query.username, password: utils.getHash(req.query.password) } }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                });
                            } else {
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        });
                    }
                }
            });

            authRouter.route('/').post(function (req, res) {

                console.log('express value ::: ' + expressApp.get('token'));

                if (req.body) {
                    if (utils.isValidEmail(req.body.username.trim())) {
                        app.UserModel.findOne({ where: { email: req.body.username, password: utils.getHash(req.body.password) } }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                });
                            } else {
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        });
                    } else if (utils.isValidMSISDN(req.body.username.trim())) {
                        app.UserModel.findOne({ where: { email: req.body.username, password: utils.getHash(req.body.password) } }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token
                                });
                            } else {
                                res.status(400).send('Unsuccessful Authentication');
                            }
                        });
                    }
                }
            });

            return authRouter;
        }
    }]);

    return AuthRoutes;
}();

exports.default = AuthRoutes;
;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BankStatementRoutes = function () {
    function BankStatementRoutes(BankStatements, ICBanks, UserModel) {
        _classCallCheck(this, BankStatementRoutes);

        this.BankStatements = BankStatements;
        this.ICBanks = ICBanks;
        this.UserModel = UserModel;
    }

    _createClass(BankStatementRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var bankStatementRouter = _express2.default.Router();
            var utils = __webpack_require__(1);

            //Middleware to check all request comes from an admin
            bankStatementRouter.use('/*', function (req, res, next) {
                if (req.query.username === undefined) {
                    req.query.username = '';
                }

                if (req.query.password === undefined) {
                    req.query.password = '';
                }

                if (req.query.username.trim().length > 6 && req.query.password.trim().length > 5) {
                    if (utils.isValidEmail(req.query.username.trim())) {
                        app.UserModel.findOne({ where: { email: req.query.username, password: utils.getHash(req.query.password), is_admin: 'Y' } }).then(function (user) {
                            if (user) {
                                next();
                            } else {
                                res.status(400).send('user does not exist');
                            }
                        });
                    } else if (utils.isValidMSISDN(req.query.username.trim())) {
                        app.UserModel.findOne({ where: { msisdn: req.query.username, password: utils.getHash(req.query.password), is_admin: 'Y' } }).then(function (user) {
                            if (user) {
                                next();
                            } else {
                                res.status(400).send('user does not exist');
                            }
                        });
                    } else {
                        res.status(404).json({ success: false });
                    }
                } else {
                    res.status(400).send('Username and Password required');
                }
            });

            bankStatementRouter.route('/').get(function (req, res) {
                app.BankStatements.findAll({ where: { status: 'A' }, include: [app.ICBanks] }).then(function (statements) {
                    res.status(200).json(statements);
                });
            });

            bankStatementRouter.route('/:id').get(function (req, res) {
                app.BankStatements.findById(req.params.id).then(function (statement) {
                    res.status(200).json(statement);
                });
            });

            bankStatementRouter.route('/today').get(function (req, res) {
                var today = new Date();
                app.BankStatements.findAll({ where: { created_at: today } }).then(function (statement) {
                    res.status(200).json(statement);
                });
            });

            bankStatementRouter.route('/date/:date').get(function (req, res) {
                var date = new Date(req.params.date);

                //const date = new Date(Date.UTC(d.getYear(), d.getMonth(), d.getDate()));
                console.log('Date => ' + date);
                app.BankStatements.findAll({ where: { created_at: date } }).then(function (statement) {
                    res.status(200).json(statement);
                });
            });

            return bankStatementRouter;
        }
    }]);

    return BankStatementRoutes;
}();

exports.default = BankStatementRoutes;
;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiscRoutes = function () {
    function MiscRoutes(Users, Accounts, Approvers, Companys) {
        _classCallCheck(this, MiscRoutes);

        this.Users = Users;
        this.Accounts = Accounts;
        this.Approvers = Approvers;
        this.Companys = Companys;
    }

    _createClass(MiscRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var miscRouter = _express2.default.Router();

            miscRouter.route('/user/:id/complete_registration').put(function (req, res) {
                app.Users.findOne({ where: { id: req.params.id, status: 'A' } }).then(function (user) {
                    return user;
                }).then(function (user) {
                    if (req.body.secondary_branch_id !== null && req.body.secondary_branch_id !== undefined && req.body.secondary_approver_msisdn !== null && req.body.secondary_approver_msisdn !== undefined) {
                        //Save bulk   
                        console.log('Doing Multiple Save On All');
                        app.doSecondaryUpdate(req, res, user);
                    } else if (req.body.secondary_branch_id !== null && req.body.secondary_branch_id !== undefined) {
                        console.log('Doing Multiple Bank Save');
                        app.doBankSecondaryUpdate(req, res, user);
                    } else if (req.body.secondary_approver_msisdn !== null && req.body.secondary_approver_msisdn !== undefined) {
                        console.log('Doing Multiple Approver Save');
                        app.doApproverSecondaryUpdate(req, res, user);
                    } else {
                        app.doPrimaryUpdate(req, res, user);
                    }
                });
            });

            miscRouter.route('/user/:id/company').get(function (req, res) {
                app.Users.findOne({ where: { id: req.params.id, status: 'A' } }).then(function (user) {
                    return user;
                }).then(function (user) {
                    return app.Companys.findOne({ where: { id: user.company_id } }).then(function (company) {
                        return company;
                    });
                }).then(function (company) {
                    res.status(200).json(company);
                });
            });

            miscRouter.route('/').post(function (req, res) {
                if (req.body) {
                    app.Banks.create(req.body).then(function (bank) {
                        res.status(200).json(bank);
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            miscRouter.route('/:id').delete(function (req, res) {
                app.Banks.update({ status: 'D' }, { where: { id: req.params.id } }).then(function (bank) {
                    res.status(200).json(bank);
                });
            });

            return miscRouter;
        }
    }, {
        key: 'doPrimaryUpdate',
        value: function doPrimaryUpdate(req, res, user) {
            var app = this;

            app.Accounts.create({ name: req.body.primary_account_name, user_id: user.id, account_number: req.body.primary_account_number, bank_branch_id: req.body.primary_branch_id
            }).then(function (account) {
                user.addAccount(account);
                return user;
            }).then(function (user) {
                return app.Approvers.create({ user_id: user.id, firstname: req.body.primary_approver_first, lastname: req.body.primary_approver_last, email: req.body.primary_approver_email, msisdn: req.body.primary_approver_msisdn, company_id: user.company_id }).then(function (approver) {
                    return approver;
                });
            }).then(function (approver) {
                user.addApprover(approver);
                user.update({ is_complete: true, id_type_id: req.body.id_type_id, id_number: req.body.id_number });
                return user;
            }).then(function (user) {
                if (!(parseInt(req.body.reg_number) === 0)) {
                    return app.Companys.findOne({ where: { id: user.company_id, status: 'A' } }).then(function (company) {
                        company.update({ reg_number: req.body.reg_number });
                        return user;
                    });
                } else {
                    return user;
                }
            }).then(function (user) {
                res.status(200).json(user);
            });
        }
    }, {
        key: 'doBankSecondaryUpdate',
        value: function doBankSecondaryUpdate(req, res, user) {
            var app = this;

            app.Accounts.create({ name: req.body.secondary_account_name, user_id: user.id, account_number: req.body.secondary_account_number, bank_branch_id: req.body.secondary_branch_id
            }).then(function (account) {
                user.addAccount(account);
                return user;
            }).then(function (user) {
                user.update({ is_complete: true });
                return user;
            }).then(function (user) {
                app.doPrimaryUpdate(req, res, user);
            });
        }
    }, {
        key: 'doApproverSecondaryUpdate',
        value: function doApproverSecondaryUpdate(req, res, user) {
            var app = this;

            app.Approvers.create({ user_id: user.id, firstname: req.body.secondary_approver_first, lastname: req.body.secondary_approver_last, email: req.body.secondary_approver_email, msisdn: req.body.secondary_approver_msisdn, company_id: user.company_id
            }).then(function (approver) {
                return approver;
            }).then(function (approver) {
                user.addApprover(approver);
                user.update({ is_complete: true });
                return user;
            }).then(function (user) {
                app.doPrimaryUpdate(req, res, user);
            });
        }
    }, {
        key: 'doSecondaryUpdate',
        value: function doSecondaryUpdate(req, res, user) {
            var app = this;

            app.Accounts.create({ name: req.body.secondary_account_name, user_id: user.id, account_number: req.body.secondary_account_number, bank_branch_id: req.body.secondary_branch_id
            }).then(function (account) {
                user.addAccount(account);
                return user;
            }).then(function (user) {
                return app.Approvers.create({ user_id: user.id, firstname: req.body.secondary_approver_first, lastname: req.body.secondary_approver_last, email: req.body.secondary_approver_email, msisdn: req.body.secondary_approver_msisdn, company_id: user.company_id }).then(function (approver) {
                    return approver;
                });
            }).then(function (approver) {
                user.addApprover(approver);
                user.update({ is_complete: true });
                return user;
            }).then(function (user) {
                app.doPrimaryUpdate(req, res, user);
            });
        }
    }]);

    return MiscRoutes;
}();

exports.default = MiscRoutes;
;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccountsRoutes = function () {
    function AccountsRoutes(AccountModel, BranchModel, BankModel, UserModel) {
        _classCallCheck(this, AccountsRoutes);

        this.AccountModel = AccountModel;
        this.BranchModel = BranchModel;
        this.BankModel = BankModel;
        this.UserModel = UserModel;
    }

    _createClass(AccountsRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var accountsRouter = _express2.default.Router();

            accountsRouter.route('/').get(function (req, res) {
                app.AccountModel.findAll({ where: { status: 'A' }, limit: 150, include: [app.UserModel] }).then(function (accounts) {
                    res.status(200).json(accounts);
                });
            });

            accountsRouter.route('/user/:id').get(function (req, res) {
                var container = [];
                app.AccountModel.findAll({ where: { user_id: req.params.id }, all: true, include: [{ model: app.BranchModel, include: [{ model: app.BankModel }] }] }).then(function (accounts) {
                    if (accounts) {
                        var _container = [];
                        accounts.map(function (account, i) {
                            var account_id = account.id;
                            var user_id = account.user_id;
                            var account_name = account.name;
                            var account_number = account.account_number;
                            var branch_name = account.bank_branch.name;
                            var bank_name = account.bank_branch.bank.name;

                            _container.push({ account_id: account_id, user_id: user_id, account_name: account_name, account_number: account_number, branch_name: branch_name, bank_name: bank_name });
                            if (i === accounts.length - 1) {
                                res.status(200).json(_container);
                            }
                        });
                    } else {
                        res.status(200).json(null);
                    }
                });
            });

            accountsRouter.route('/balance/:user_id').get(function (req, res) {
                app.UserModel.findOne({ where: { id: req.params.user_id, status: 'A' }, attributes: ['id', 'available_balance', 'actual_balance'] }).then(function (user) {
                    if (user) {
                        res.status(200).json(user);
                    } else {
                        res.status(403).send('Nothing Found');
                    }
                });
            });

            accountsRouter.route('/').post(function (req, res) {
                if (req.body) {
                    app.AccountModel.create(req.body).then(function (account) {
                        res.status(200).json(account);
                    });
                } else {
                    res.status(200).send('Data not saved!');
                }
            });

            accountsRouter.route('/:id').delete(function (req, res) {});

            return accountsRouter;
        }
    }]);

    return AccountsRoutes;
}();

exports.default = AccountsRoutes;
;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import multer from 'multer';


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _request = __webpack_require__(3);

var _request2 = _interopRequireDefault(_request);

var _dateformat = __webpack_require__(6);

var _dateformat2 = _interopRequireDefault(_dateformat);

var _config = __webpack_require__(2);

var d = _interopRequireWildcard(_config);

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

var _bodyParser = __webpack_require__(9);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _util = __webpack_require__(37);

var _util2 = _interopRequireDefault(_util);

var _jsonwebtoken = __webpack_require__(8);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import express_formidable from 'express-formidable';


var UtilsRoutes = function () {
    function UtilsRoutes(UsersModel, TracksModel, CompanyModel, BankModel, BranchModel, IDModel, RequestModel, AccountModel, ApproveModel, ICBankModel, PayOutModel, WithdrawModel, TransactionModel) {
        _classCallCheck(this, UtilsRoutes);

        this.app = this;
        this.UsersModel = UsersModel;
        this.TracksModel = TracksModel;
        this.CompanyModel = CompanyModel;
        this.BankModel = BankModel;
        this.BranchModel = BranchModel;
        this.IDModel = IDModel;
        this.RequestModel = RequestModel;
        this.AccountModel = AccountModel;
        this.ApproveModel = ApproveModel;
        this.ICBankModel = ICBankModel;
        this.PayOutModel = PayOutModel;
        this.WithdrawModel = WithdrawModel;
        this.TransactionModel = TransactionModel;
    }

    _createClass(UtilsRoutes, [{
        key: 'getGeneratedId',
        value: function getGeneratedId(count, type) {
            var now = new Date();
            var year = (0, _dateformat2.default)(now, "yy");
            var month = (0, _dateformat2.default)(now, "mm");

            //Bubble the zeros
            var id = '';
            switch ((count + '').length) {
                case 1:
                    {
                        id = '0000' + count;
                        break;
                    };
                case 2:
                    {
                        id = '000' + count;
                        break;
                    }
                case 3:
                    {
                        id = '00' + count;
                        break;
                    }
                case 4:
                    {
                        id = '0' + count;
                        break;
                    }
                case 5:
                    {
                        id = '' + count;
                    }

                default:
                    id = count;
            }

            console.log('' + type + year + id + month);
            return '' + type + year + id + month;
        }
    }, {
        key: 'updateIndividualPaymentNumber',
        value: function updateIndividualPaymentNumber(user, res) {
            var app = this;
            var expressApp = (0, _express2.default)();
            var utils = __webpack_require__(1);

            expressApp.set('token', d.config.secret);

            if (user.type === 'I') {
                app.TracksModel.findById(1).then(function (track) {
                    var newCount = track.count + 1;
                    var paymentId = app.getGeneratedId(newCount, '01');

                    //Update count
                    app.TracksModel.update({ count: newCount }, { where: { id: 1 } }).then(function (track) {

                        //Update user
                        if (track) {
                            app.UsersModel.update({ payment_number: paymentId, company_id: 1 }, { where: { id: user.id } }).then(function (tmpuser) {
                                if (tmpuser) {
                                    app.UsersModel.findOne({ where: { id: user.id }, attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status'] }).then(function (user) {
                                        if (user) {
                                            var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                            res.status(200).json({
                                                user: user,
                                                success: true,
                                                message: 'Successful',
                                                token: token
                                            });
                                            utils.sendWelcomeMail(user.email, user.firstname);
                                        }
                                    });
                                } else {
                                    res.status(400).send('Could not update');
                                }
                            });
                        } else {

                            console.log('Something happened !');
                            res.status(400).send('Something went wrong');
                        }
                    });
                });
            }
        }
    }, {
        key: 'updateCompanyPaymentNumber',
        value: function updateCompanyPaymentNumber(user, res) {
            var app = this;

            var expressApp = (0, _express2.default)();

            expressApp.set('token', d.config.secret);

            if (user.type === 'C') {
                app.TracksModel.findById(2).then(function (track) {
                    var newCount = track.count + 1;
                    var paymentId = app.getGeneratedId(newCount, '00');

                    //Update count
                    app.TracksModel.update({ count: newCount }, { where: { id: 2 } }).then(function (track) {

                        if (track) {

                            //Save company
                            app.CompanyModel.create({ name: user.cname.toLowerCase(), location: user.lname }).then(function (company) {
                                if (company) {

                                    //Update user
                                    app.UsersModel.update({ payment_number: paymentId, company_id: company.id }, { where: { id: user.id } }).then(function (tmpuser) {
                                        if (tmpuser) {
                                            app.UsersModel.findOne({ where: { id: user.id }, attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'status'] }).then(function (user) {
                                                if (user) {
                                                    var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                                    res.status(200).json({
                                                        user: user,
                                                        success: true,
                                                        message: 'Successful',
                                                        token: token
                                                    });
                                                }
                                            });
                                        } else {
                                            res.status(400).send('Could not update');
                                        }
                                    });
                                }
                            });
                        } else {

                            console.log('Something happened !');
                            res.status(400).send('Something went wrong');
                        }
                    });
                });
            }
        }
    }, {
        key: 'routes',
        value: function routes() {
            var app = this;

            var utilsRouter = _express2.default.Router();
            var expressApp = (0, _express2.default)();

            utilsRouter.use(_bodyParser2.default.json({ limit: '50mb' }));
            utilsRouter.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true }));

            //utilsRouter.use(express_formidable());


            var utils = __webpack_require__(1);
            //let upload  = multer({storage: app.storage}).any();

            expressApp.set('token', d.config.secret);

            utilsRouter.route('/login').get(function (req, res) {

                if (req.query && req.query.username.trim().length > 0 && req.query.password.trim().length > 0) {
                    if (utils.isValidEmail(req.query.username.trim())) {
                        app.UsersModel.findOne({ where: { email: req.query.username, password: utils.getHash(req.query.password) }, attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'is_admin', 'status'] }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token,
                                    user: user
                                });
                            } else {
                                res.status(400).json('something wrong happened');
                            }
                        });
                    } else if (utils.isValidMSISDN(req.query.username.trim())) {
                        app.UsersModel.findOne({ where: { msisdn: req.query.username, password: utils.getHash(req.query.password) }, attributes: ['id', 'firstname', 'lastname', 'email', 'msisdn', 'type', 'kin', 'kin_msisdn', 'company_id', 'payment_number', 'is_complete', 'is_admin', 'status'] }).then(function (user) {
                            if (user) {
                                var token = _jsonwebtoken2.default.sign({ user: user }, expressApp.get('token'), { expiresIn: '1d' });
                                res.status(200).json({
                                    success: true,
                                    message: 'Successful',
                                    token: token,
                                    user: user
                                });
                            } else {
                                res.status(400).send('something wrong happened');
                            }
                        });
                    }
                } else {
                    res.status(400).send('Data not received');
                }
            });

            utilsRouter.route('/is_email_exist/:email').get(function (req, res) {
                if (utils.isValidEmail(req.params.email.trim())) {
                    app.UsersModel.findOne({ where: { email: req.params.email } }).then(function (user) {
                        if (user) {
                            res.status(200).json({ is_exist: true });
                        } else {
                            res.status(200).json({ is_exist: false });
                        }
                    });
                } else {
                    res.status(400).send('Wrong EMAIL format');
                }
            });

            utilsRouter.route('/icbanks').get(function (req, res) {
                app.ICBankModel.findAll({ where: { status: 'A' } }).then(function (banks) {
                    res.status(200).json(banks);
                });
            });

            utilsRouter.route('/idtypes').get(function (req, res) {
                app.IDModel.findAll({ where: { status: 'A' } }).then(function (ids) {
                    res.status(200).json(ids);
                });
            });

            utilsRouter.route('/branches/:bank_id').get(function (req, res) {
                app.BranchModel.findAll({ where: { status: 'A', bank_id: req.params.bank_id }, order: [['name', 'ASC']] }).then(function (branches) {
                    res.status(200).json(branches);
                });
            });

            utilsRouter.route('/is_msisdn_exist/:msisdn').get(function (req, res) {
                if (utils.isValidMSISDN(req.params.msisdn.trim())) {
                    app.UsersModel.findOne({ where: { msisdn: req.params.msisdn } }).then(function (user) {
                        if (user) {
                            res.status(200).json({ is_exist: true });
                        } else {
                            res.status(200).json({ is_exist: false });
                        }
                    });
                } else {
                    res.status(200).json('Wrong MSISN format');
                }
            });

            utilsRouter.route('/is_corporate_exist/:corporate').get(function (req, res) {
                if (req.params.corporate.toLowerCase().trim()) {
                    app.CompanyModel.findOne({ where: { name: req.params.corporate } }).then(function (company) {
                        if (company) {
                            res.status(200).json({ is_exist: true });
                        } else {
                            res.status(200).json({ is_exist: false });
                        }
                    });
                } else {
                    res.status(200).json('Wrong corporate name');
                }
            });

            utilsRouter.route('/banks').get(function (req, res) {
                app.BankModel.findAll({ where: { status: 'A' }, order: [['name', 'ASC']] }).then(function (banks) {
                    if (banks) {
                        res.status(200).json(banks);
                    } else {
                        res.status(200).send('No Banks Available');
                    }
                });
            });

            utilsRouter.route('/adduser').post(function (req, res) {

                if (Object.keys(req.body) != 0) {
                    req.body.is_admin = 'N';

                    app.UsersModel.create(req.body).then(function (user) {
                        if (user && req.body.type === 'C') {
                            user.lname = req.body.lname;
                            user.cname = req.body.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    });
                } else if (Object.keys(req.query) != 0) {
                    req.query.is_admin = 'N';
                    app.UsersModel.create(req.query).then(function (user) {
                        if (user && req.query.type === 'C') {
                            user.lname = req.query.lname;
                            user.cname = req.query.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    }).catch(function (error) {
                        if (error) res.status(400).send('Could not save data');
                    });
                } else {
                    console.log('Passed NONE !!!');
                    res.status(400).send('JSON format required');
                }
            });

            utilsRouter.use('/adduploader', function (req, res, next) {
                console.log();
                var app = (0, _express2.default)();
                //JSON Web Token Secret
                app.set('token', d.config.secret);

                // check header or url parameters or post parameters for token
                var token = req.body.token || req.query.token || req.headers['x-access-token'];

                // decode token
                if (token) {

                    // verifies secret and checks exp
                    _jsonwebtoken2.default.verify(token, app.get('token'), function (err, decoded) {
                        if (err) {
                            return res.json({ success: false, message: 'Failed to authenticate token.' });
                        } else {
                            // if everything is good, save to request for use in other routes
                            req.decoded = decoded;
                            next();
                        }
                    });
                } else {

                    // if there is no token
                    // return an error
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.'
                    });
                }
            });

            utilsRouter.route('/adduser').post(function (req, res) {

                if (Object.keys(req.body) != 0) {
                    app.UsersModel.create(req.body).then(function (user) {
                        if (user && req.body.type === 'C') {
                            user.lname = req.body.lname;
                            user.cname = req.body.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    });
                } else if (Object.keys(req.params) != 0) {
                    app.UsersModel.create(req.params).then(function (user) {
                        if (user && req.params.type === 'C') {
                            user.lname = req.params.lname;
                            user.cname = req.params.cname;

                            app.updateCompanyPaymentNumber(user, res);
                        } else if (user && req.body.type === 'I') {
                            app.updateIndividualPaymentNumber(user, res);
                        }
                    }).catch(function (error) {
                        if (error) res.status(400).send('Could not save data');
                    });
                } else {
                    console.log('Passed NONE !!!');
                }
            });

            utilsRouter.route('/statement/upload').post(function (req, res) {
                utils.saveFile(req, res);
            });

            utilsRouter.route('/national_id/upload').post(function (req, res) {
                utils.saveID(req, res);
            });

            utilsRouter.route('/transaction/reject').post(function (req, res) {
                var uuid = req.body.uuid;

                app.RequestModel.findOne({ where: { uuid: uuid, status: 'P' } }).then(function (request) {
                    if (request) {
                        request.update({ status: 'R' }).then(function (request) {
                            app.RequestModel.findAll({ where: { transaction_code: request.transaction_code } }).then(function (requests) {
                                if (requests) {
                                    requests.map(function (request, i) {
                                        request.update({ status: 'R' });
                                        if (i === requests.length - 1) {
                                            app.UsersModel.findOne({ where: { id: request.user_id, status: 'A' } }).then(function (user) {
                                                user.increment({ 'available_balance': parseFloat(request.amount) }).then(function (user) {
                                                    res.status(200).json({ success: true });
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        res.status(400).json({ success: false });
                    }
                });
            });

            utilsRouter.route('/transaction/approve').post(function (req, res) {
                app.RequestModel.findOne({ where: { uuid: req.body.uuid, transaction_code: req.body.key, status: 'P' } }).then(function (request) {
                    if (request) {
                        app.UsersModel.findOne({ where: { id: request.user_id, status: 'A' } }).then(function (user) {
                            user.decrement({ 'actual_balance': parseFloat(request.amount) }).then(function (user) {
                                app.WithdrawModel.create({ amount: request.amount, user_id: user.id, account_id: request.account_id });
                                app.TransactionModel.create({ type: 'W', amount: request.amount, user_id: user.id, narration: 'Withdraw' });
                            });
                        });

                        request.update({ status: 'A' }).then(function (request) {
                            app.RequestModel.findAll({ where: { transaction_code: request.transaction_code, status: 'P' } }).then(function (requests) {
                                if (requests === null || requests.length === 0) {
                                    //all approval done
                                    app.PayOutModel.create({ user_id: request.user_id,
                                        amount: request.amount,
                                        account_id: request.account_id,
                                        request_date: request.created_at,
                                        status: 'P' }).then(function (payout) {
                                        if (payout) {

                                            app.UsersModel.findOne({ where: { id: payout.user_id, status: 'A' } }).then(function (user) {
                                                if (user) {
                                                    app.AccountModel.findOne({ where: { id: payout.account_id, status: 'A' }, include: [{ model: app.BranchModel, include: [{ model: app.BankModel }] }] }).then(function (account) {
                                                        utils.sendDebitMail(user.email, user.firstname, payout.amount, payout.request_date, account.bank_branch.bank.name, account.name, account.account_number);
                                                        res.status(200).json({ success: true });
                                                    });
                                                } else {
                                                    res.status(200).json({ success: true });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.status(200).json({ success: true });
                                }
                            });
                        });
                    } else {
                        res.status(400).json({ success: false });
                    }
                });
            });

            utilsRouter.route('/transaction/details/:transaction_key').get(function (req, res) {
                var key = req.params.transaction_key;

                app.RequestModel.findOne({ where: { uuid: key, status: 'P' }, include: [app.ApproveModel, app.UsersModel, { model: app.AccountModel, include: [{ model: app.BranchModel, include: [{ model: app.BankModel }] }] }] }).then(function (request) {
                    if (request) {
                        var data = {};
                        data.approver = request.approver.firstname;
                        data.amount = request.amount;
                        //data.code = request.transaction_code;
                        data.date = request.created_at;

                        data.user = request.user.firstname;
                        data.account_name = request.account.name;
                        data.account_number = request.account.account_number;
                        data.branch = request.account.bank_branch.name;
                        data.bank = request.account.bank_branch.bank.name;

                        res.status(200).json(data);
                    } else {
                        res.status(400).send('No Data');
                    }
                });
            });

            return utilsRouter;
        }
    }]);

    return UtilsRoutes;
}();

exports.default = UtilsRoutes;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _config = __webpack_require__(2);

var d = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SessionRoutes = function () {
    function SessionRoutes(UsersModel) {
        _classCallCheck(this, SessionRoutes);

        this.UsersModel = UsersModel;
    }

    _createClass(SessionRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var sessionsRouter = _express2.default.Router();
            var utils = __webpack_require__(1);

            sessionsRouter.route('/register').get(function (req, res) {
                var username = d.config.sessions_username;
                var password = d.config.sessions_password;

                app.UsersModel.findOne({ where: { msisdn: '0244000000', password: utils.getHash('000000') } }).then(function (user) {
                    if (user) {
                        req.session.user = user;
                        res.status(200).json({ session: true });
                    } else {
                        res.status(404).json('sessions error');
                    }
                });
            });

            sessionsRouter.route('/:id').get(function (req, res) {
                res.status(200).send('not implemented');
            });

            return sessionsRouter;
        }
    }]);

    return SessionRoutes;
}();

exports.default = SessionRoutes;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UploadRoutes = function () {
    function UploadRoutes(BankStatement) {
        _classCallCheck(this, UploadRoutes);

        this.BankStatement = BankStatement;
    }

    _createClass(UploadRoutes, [{
        key: 'routes',
        value: function routes() {
            var app = this;
            var uploadRouter = _express2.default.Router();

            uploadRouter.route('/').get(function (req, res) {
                app.Banks.findAll({ where: { status: 'A' }, limit: 150 }).then(function (banks) {
                    res.status(200).json(banks);
                });
            });

            uploadRouter.route('/:id').get(function (req, res) {
                app.Banks.findById(req.params.id).then(function (bank) {
                    res.status(200).json(bank);
                });
            });

            uploadRouter.route('/').post(function (req, res) {

                console.log('bank_id => ' + req.body.bank_id);

                var utils = __webpack_require__(1);
                utils.saveFile(req, res);
            });

            uploadRouter.route('/:id').delete(function (req, res) {
                app.Banks.update({ status: 'D' }, { where: { id: req.params.id } }).then(function (bank) {
                    res.status(200).json(bank);
                });
            });

            return uploadRouter;
        }
    }]);

    return UploadRoutes;
}();

exports.default = UploadRoutes;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = [{"id":1,"name":"GN Bank","code":"GNBK"},{"id":2,"name":"BEST POINT SAVINGS AND LOANS","code":"79895"},{"id":3,"name":"ACCESS BANK CHG","code":"280100"},{"id":4,"name":"AGRIC. DEVELOPMENT BANK","code":"80100"},{"id":5,"name":"ARB APEX & RURAL BANKS","code":"70100"},{"id":6,"name":"BARCLAYS BANK","code":"30100"},{"id":7,"name":"BANK OF BARODA (GH) LTD.","code":"260100"},{"id":8,"name":"BANK OF AFRICA -GHANA LTD","code":"210100"},{"id":9,"name":"BANK OF GHANA","code":"10100"},{"id":10,"name":"BSIC GHANA LTD.","code":"270100"},{"id":11,"name":"CAL BANK LTD","code":"140100"},{"id":12,"name":"ECOBANK (GH) LTD","code":"130100"},{"id":13,"name":"ENERGY BANK CHG","code":"290100"},{"id":14,"name":"FIRST ATLANTIC MERCHANT","code":"170100"},{"id":15,"name":"FIRST CAPITAL PLUS BANK","code":"0000"},{"id":16,"name":"FIDELITY BANK GHANA LTD","code":"240100"},{"id":17,"name":"GHANA COMMERCIAL BANK","code":"40100"},{"id":18,"name":"GHIPSS DR CHG","code":"999999"},{"id":19,"name":"GUARANTY TRUST (GH) LTD.","code":"230100"},{"id":20,"name":"HFC BANK (GH) LTD","code":"110100"},{"id":21,"name":"INTERNATIONAL COMMERIAL","code":"200100"},{"id":22,"name":"INTERCONTINENTAL BANK","code":"250100"},{"id":23,"name":"MERCHANT BANK (GH) LTD","code":"100100"},{"id":24,"name":"NATIONAL INVESTMENT BANK","code":"50100"},{"id":25,"name":"PRUDENTIAL BANK LTD.","code":"180100"},{"id":26,"name":"STANDARD CHARTERED BANK","code":"20100"},{"id":27,"name":"SG  SSB  LTD","code":"90100"},{"id":28,"name":"STANBIC BANK GHANA LTD","code":"190100"},{"id":29,"name":"The Royal Bank CHG","code":"300100"},{"id":30,"name":"THE TRUST BANK","code":"150100"},{"id":31,"name":"UNITED BANK FOR AFRICA","code":"60100"}]

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = [{"name":"Tamale","code":"0000","bank_id":1},{"name":"Community 6","code":"0000","bank_id":1},{"name":"MAKOLA BRANCH","code":"78","bank_id":2},{"name":"ENCHI BRANCH","code":"280404","bank_id":3},{"name":"TAMALE BRANCH","code":"280801","bank_id":3},{"name":"KUMASI ASAFO BRANCH","code":"280601","bank_id":3},{"name":"CASTLE ROAD BRANCH","code":"280108","bank_id":3},{"name":"OSU WATSON BRANCH","code":"280105","bank_id":3},{"name":"ACHIMOTA BRANCH","code":"280118","bank_id":3},{"name":"KANESHIE BRANCH","code":"280107","bank_id":3},{"name":"MADINA BRANCH","code":"280109","bank_id":3},{"name":"NIA BRANCH","code":"280111","bank_id":3},{"name":"SEFWI BRANCH","code":"280403","bank_id":3},{"name":"TEMA MAIN BRANCH","code":"280102","bank_id":3},{"name":"TAKORADI BRANCH","code":"280402","bank_id":3},{"name":"LASHIBI BRANCH","code":"280104","bank_id":3},{"name":"AMAKOM BRANCH","code":"280604","bank_id":3},{"name":"TECHIMAN BRANCH","code":"280701","bank_id":3},{"name":"TIA BRANCH","code":"280121","bank_id":3},{"name":"OKAISHIE BRANCH","code":"280115","bank_id":3},{"name":"ABEKA LAPAZ BRANCH","code":"280114","bank_id":3},{"name":"KANTAMANTO BRANCH","code":"280106","bank_id":3},{"name":"EAST CANTONMENTS BRANCH","code":"280101","bank_id":3},{"name":"SUAME BRANCH","code":"280603","bank_id":3},{"name":"RING ROAD CENTRAL BRANCH","code":"280112","bank_id":3},{"name":"IPS BRANCH","code":"280117","bank_id":3},{"name":"HEAD OFFICE","code":"280100","bank_id":3},{"name":"KANESHIE POST OFFICE BRANCH","code":"280113","bank_id":3},{"name":"OSU  OXFORD BRANCH","code":"280103","bank_id":3},{"name":"SOUTH INDUSTRIAL BRANCH","code":"280110","bank_id":3},{"name":"ADUM BRANCH","code":"280602","bank_id":3},{"name":"ASHAIMAN BRANCH","code":"280116","bank_id":3},{"name":"AIRPORT BRANCH","code":"280122","bank_id":3},{"name":"TARKWA BRANCH","code":"280401","bank_id":3},{"name":"NIMA BRANCH","code":"280120","bank_id":3},{"name":"TEMA COMMUNITY 1 BRANCH","code":"280119","bank_id":3},{"name":"NAVRONGO","code":"80993","bank_id":4},{"name":"TECHIMAN","code":"80776","bank_id":4},{"name":"AGONA SWEDRU","code":"80115","bank_id":4},{"name":"INTERNATIONAL BANKING","code":"80107","bank_id":4},{"name":"NEW EDUBIASE","code":"80663","bank_id":4},{"name":"HEAD OFFICE","code":"80100","bank_id":4},{"name":"WA","code":"80995","bank_id":4},{"name":"NKORANSAH","code":"80775","bank_id":4},{"name":"CEDI HOUSE","code":"80106","bank_id":4},{"name":"BONSO NKWANTA","code":"80686","bank_id":4},{"name":"DORMAA AHENKRO","code":"80772","bank_id":4},{"name":"NKWANTA","code":"80554","bank_id":4},{"name":"KUMASI ASOKWA","code":"80666","bank_id":4},{"name":"SOGAKOPE","code":"80557","bank_id":4},{"name":"AMAKOM","code":"80668","bank_id":4},{"name":"BEREKUM","code":"80774","bank_id":4},{"name":"KANESSHIE","code":"80105","bank_id":4},{"name":"NUNGUA","code":"80110","bank_id":4},{"name":"HO","code":"80552","bank_id":4},{"name":"ADABRAKA","code":"80102","bank_id":4},{"name":"KASOA","code":"80127","bank_id":4},{"name":"ACHIMOTA","code":"80117","bank_id":4},{"name":"MADINA","code":"80113","bank_id":4},{"name":"GULF HOUSE","code":"80108","bank_id":4},{"name":"OBUASI","code":"80664","bank_id":4},{"name":"TAMALE ABOABO","code":"80882","bank_id":4},{"name":"BKWAI","code":"80662","bank_id":4},{"name":"DENU","code":"80555","bank_id":4},{"name":"TAKORADI","code":"80441","bank_id":4},{"name":"CAPE COAST","code":"80331","bank_id":4},{"name":"KPANDO","code":"80553","bank_id":4},{"name":"KUMASI ADUM","code":"80661","bank_id":4},{"name":"TEMA","code":"80103","bank_id":4},{"name":"JUAPONG","code":"80556","bank_id":4},{"name":"ENCHI","code":"80444","bank_id":4},{"name":"SEFWI WIAWSO","code":"80684","bank_id":4},{"name":"KOFORIDUA","code":"80221","bank_id":4},{"name":"SUHUM","code":"80222","bank_id":4},{"name":"MANKESSIM","code":"80334","bank_id":4},{"name":"KUMASI PREMPEH 11 STREET","code":"80667","bank_id":4},{"name":"ASSIN FOSO","code":"80332","bank_id":4},{"name":"DANQUAH CIRCLE","code":"80125","bank_id":4},{"name":"ACCRA NEW TOWN","code":"80120","bank_id":4},{"name":"YENDI","code":"80883","bank_id":4},{"name":"AGONA NKWANTA","code":"80446","bank_id":4},{"name":"ADB HOUSE BRANCH","code":"80116","bank_id":4},{"name":"SUNYANI","code":"80771","bank_id":4},{"name":"TESHIE","code":"80104","bank_id":4},{"name":"NKAWKAW","code":"80223","bank_id":4},{"name":"DANSOMAN","code":"80109","bank_id":4},{"name":"SEFWI ESSAM","code":"80687","bank_id":4},{"name":"TAMALE","code":"80881","bank_id":4},{"name":"ASHIAMAN","code":"80124","bank_id":4},{"name":"MAKOLA","code":"80119","bank_id":4},{"name":"UCC","code":"80333","bank_id":4},{"name":"KORKORDZOR","code":"80111","bank_id":4},{"name":"KUMASI CENTRAL  MARKET","code":"80665","bank_id":4},{"name":"KWAPONG","code":"80778","bank_id":4},{"name":"RING ROAD CENTRAL","code":"80101","bank_id":4},{"name":"KENYASE","code":"80779","bank_id":4},{"name":"OSU","code":"80112","bank_id":4},{"name":"SPINTEX ROAD","code":"80118","bank_id":4},{"name":"GOASO","code":"80777","bank_id":4},{"name":"ATEBUBU","code":"80685","bank_id":4},{"name":"HOHOE","code":"81151","bank_id":4},{"name":"ABEKALAPAZ","code":"80114","bank_id":4},{"name":"BAWKU","code":"80992","bank_id":4},{"name":"BOLGATANGA","code":"80991","bank_id":4},{"name":"OSINO","code":"70208","bank_id":5},{"name":"ESSUEHYIA","code":"70307","bank_id":5},{"name":"AMUANA PRASO","code":"70211","bank_id":5},{"name":"SENYA BREKU","code":"70122","bank_id":5},{"name":"HO CENTRE","code":"70501","bank_id":5},{"name":"AWUMASA","code":"70116","bank_id":5},{"name":"ASSIN AKROPONG","code":"70308","bank_id":5},{"name":"WASSA AKROPONG","code":"70403","bank_id":5},{"name":"GUAMAN","code":"71102","bank_id":5},{"name":"WAMFIE","code":"70703","bank_id":5},{"name":"KAASE","code":"70715","bank_id":5},{"name":"SANDEMA","code":"70906","bank_id":5},{"name":"MAMFE","code":"70107","bank_id":5},{"name":"WA","code":"71005","bank_id":5},{"name":"KOFORIDUA","code":"70218","bank_id":5},{"name":"ASUOM","code":"70212","bank_id":5},{"name":"CEDI HOUSECED HOUSE","code":"70126","bank_id":5},{"name":"SAMPA","code":"70718","bank_id":5},{"name":"KUMAWU","code":"70608","bank_id":5},{"name":"ESIAMA","code":"70402","bank_id":5},{"name":"KWAHU PRASO","code":"70206","bank_id":5},{"name":"GAMBAGA","code":"70905","bank_id":5},{"name":"KUMASI","code":"70633","bank_id":5},{"name":"ASOKRE","code":"70604","bank_id":5},{"name":"KWAHU PEPEASE","code":"70203","bank_id":5},{"name":"ELMINA","code":"70303","bank_id":5},{"name":"NSOATRE","code":"70711","bank_id":5},{"name":"JAMASI","code":"70618","bank_id":5},{"name":"ANKWAWSO","code":"70626","bank_id":5},{"name":"AMASAMAN","code":"70117","bank_id":5},{"name":"AYAMFURI","code":"70613","bank_id":5},{"name":"JUANSA","code":"70605","bank_id":5},{"name":"JUABEN","code":"70621","bank_id":5},{"name":"","code":"70722","bank_id":5},{"name":"WA CENTRE","code":"71001","bank_id":5},{"name":"WIOSO","code":"70610","bank_id":5},{"name":"ODUMASE","code":"70104","bank_id":5},{"name":"ACCRA","code":"70102","bank_id":5},{"name":"AKROFUOM","code":"70609","bank_id":5},{"name":"NYINAHIM","code":"70619","bank_id":5},{"name":"ANLOGA","code":"70123","bank_id":5},{"name":"BAREKESE","code":"70623","bank_id":5},{"name":"TOASE","code":"70624","bank_id":5},{"name":"BADU","code":"70710","bank_id":5},{"name":"KASSEH","code":"70110","bank_id":5},{"name":"KINTAMPO","code":"70702","bank_id":5},{"name":"AKUMA","code":"70707","bank_id":5},{"name":"KASEI","code":"70628","bank_id":5},{"name":"KUMASI","code":"70631","bank_id":5},{"name":"BRAKWA","code":"70111","bank_id":5},{"name":"TORYA RURAL BANK LTD","code":"70627","bank_id":5},{"name":"TEASE","code":"70209","bank_id":5},{"name":"SEIKWA","code":"70714","bank_id":5},{"name":"DABALE","code":"70120","bank_id":5},{"name":"TUMA","code":"71004","bank_id":5},{"name":"ACHIASE","code":"70204","bank_id":5},{"name":"ZIBILLA","code":"70907","bank_id":5},{"name":"AKATSI","code":"70503","bank_id":5},{"name":"SEKYEDUMASI","code":"70603","bank_id":5},{"name":"CAPE COASTCAPE COAST","code":"70301","bank_id":5},{"name":"ACCRA","code":"70127","bank_id":5},{"name":"PAGA","code":"70902","bank_id":5},{"name":"LA","code":"70125","bank_id":5},{"name":"WASSA AKROPONG","code":"70410","bank_id":5},{"name":"WORAWORA","code":"71103","bank_id":5},{"name":"KUMASIKUMASI","code":"70601","bank_id":5},{"name":"ASSIN MANSO","code":"70305","bank_id":5},{"name":"ACERENSUA","code":"70706","bank_id":5},{"name":"BIRIWA","code":"70310","bank_id":5},{"name":"KUMASI","code":"70632","bank_id":5},{"name":"HO","code":"70506","bank_id":5},{"name":"MANSO","code":"70408","bank_id":5},{"name":"SUNYANI","code":"70720","bank_id":5},{"name":"BOMAA","code":"70709","bank_id":5},{"name":"AFOSU","code":"70202","bank_id":5},{"name":"JACOBU","code":"70615","bank_id":5},{"name":"KUMBUNGU","code":"70802","bank_id":5},{"name":"AYIREBI","code":"70213","bank_id":5},{"name":"FOMENA","code":"70607","bank_id":5},{"name":"KOFORIDUA","code":"70201","bank_id":5},{"name":"TAMALE CENTRE","code":"70801","bank_id":5},{"name":"OFRAMASE","code":"70216","bank_id":5},{"name":"APAM","code":"70105","bank_id":5},{"name":"BUSUNYA","code":"70708","bank_id":5},{"name":"BOLGATANGA","code":"70908","bank_id":5},{"name":"SOUTH RIDGE ACCRA","code":"70101","bank_id":5},{"name":"WIAMOASE","code":"70612","bank_id":5},{"name":"ADIDOME","code":"70502","bank_id":5},{"name":"KOMENDA","code":"70306","bank_id":5},{"name":"WALEWALE","code":"70904","bank_id":5},{"name":"KWAMANG","code":"70606","bank_id":5},{"name":"AKIM SWEDRU","code":"70210","bank_id":5},{"name":"ACCRA","code":"70128","bank_id":5},{"name":"SAVELEGU","code":"70803","bank_id":5},{"name":"NYAKROM","code":"70103","bank_id":5},{"name":"KASOA","code":"70124","bank_id":5},{"name":"KUNTANASE","code":"70611","bank_id":5},{"name":"AFRANSI","code":"70113","bank_id":5},{"name":"ABESIM","code":"70719","bank_id":5},{"name":"KWANYAKU","code":"70114","bank_id":5},{"name":"PRANG","code":"70622","bank_id":5},{"name":"SEFWI","code":"70614","bank_id":5},{"name":"TWIFO AGONA","code":"70309","bank_id":5},{"name":"TAMALE","code":"70805","bank_id":5},{"name":"NEW TAFO","code":"70217","bank_id":5},{"name":"FANTI NYANKUMASE","code":"70304","bank_id":5},{"name":"PAKYI NO. 2","code":"70616","bank_id":5},{"name":"AWUTU BAWJIASE","code":"70119","bank_id":5},{"name":"SHAMA","code":"70406","bank_id":5},{"name":"AWIEBO","code":"70404","bank_id":5},{"name":"KPEVE","code":"70505","bank_id":5},{"name":"TIKOBO NO. 1","code":"70405","bank_id":5},{"name":"SUNYANI CENTRE","code":"70701","bank_id":5},{"name":"DODOWA","code":"70109","bank_id":5},{"name":"SUNYANI","code":"70721","bank_id":5},{"name":"GOMOA","code":"70115","bank_id":5},{"name":"FOASE","code":"70602","bank_id":5},{"name":"KOFIASE","code":"70625","bank_id":5},{"name":"HOHOE","code":"71105","bank_id":5},{"name":"BOLGA CENTRE","code":"70901","bank_id":5},{"name":"ZIOPE","code":"70504","bank_id":5},{"name":"DROBO","code":"70717","bank_id":5},{"name":"ANTOAKROM","code":"70620","bank_id":5},{"name":"ENYAN DENKYIRA","code":"70302","bank_id":5},{"name":"NANKESE","code":"70214","bank_id":5},{"name":"JIRAPA","code":"71003","bank_id":5},{"name":"KWABENG","code":"70207","bank_id":5},{"name":"AGONA NKWANTA","code":"70409","bank_id":5},{"name":"ABOKOBI","code":"70118","bank_id":5},{"name":"","code":"70129","bank_id":5},{"name":"ANUM","code":"70106","bank_id":5},{"name":"","code":"70806","bank_id":5},{"name":"TAKORADI CENTRE","code":"70401","bank_id":5},{"name":"KUKUOM","code":"70716","bank_id":5},{"name":"DERMA","code":"70712","bank_id":5},{"name":"SUMA AHENKRO","code":"70704","bank_id":5},{"name":"HOHOE","code":"71104","bank_id":5},{"name":"GOMOA","code":"70112","bank_id":5},{"name":"BOGOSO","code":"70407","bank_id":5},{"name":"ANOMA RURAL BANK LTD","code":"70215","bank_id":5},{"name":"NSUTA","code":"70629","bank_id":5},{"name":"ASESEWA","code":"70205","bank_id":5},{"name":"TAMALE","code":"70804","bank_id":5},{"name":"GARU","code":"70903","bank_id":5},{"name":"HOHOE CENTRE","code":"71101","bank_id":5},{"name":"MEPE","code":"70121","bank_id":5},{"name":"NANDOM","code":"71002","bank_id":5},{"name":"PRAMPRAM","code":"70108","bank_id":5},{"name":"SEFWI","code":"70630","bank_id":5},{"name":"Tema Main","code":"1233","bank_id":6},{"name":"GUMANI","code":"30871","bank_id":6},{"name":"BCM","code":"30116","bank_id":6},{"name":"AGOGO","code":"30658","bank_id":6},{"name":"HO","code":"30539","bank_id":6},{"name":"MATAHEKO","code":"30193","bank_id":6},{"name":"KOTOBABI","code":"30196","bank_id":6},{"name":"MANKESSIM","code":"30367","bank_id":6},{"name":"AHODWO","code":"30683","bank_id":6},{"name":"KONONGO","code":"30677","bank_id":6},{"name":"NEW SUAME MAGAZINE","code":"30653","bank_id":6},{"name":"OLD SUAME MAGAZINE","code":"30657","bank_id":6},{"name":"PREMPEH II STREET","code":"30627","bank_id":6},{"name":"ACHIMOTA","code":"30111","bank_id":6},{"name":"ACCRA MALL","code":"30105","bank_id":6},{"name":"TECHIMAN","code":"30718","bank_id":6},{"name":"ACCRA NEWTOWN","code":"30169","bank_id":6},{"name":"OBUASI","code":"30638","bank_id":6},{"name":"HOHOE","code":"30540","bank_id":6},{"name":"LEGON MAIN","code":"30125","bank_id":6},{"name":"SME CENTRE","code":"30161","bank_id":6},{"name":"A AND C MALL","code":"30104","bank_id":6},{"name":"ABOSSEY OKAI","code":"30195","bank_id":6},{"name":"SPINTEX PRESTIGE","code":"30145","bank_id":6},{"name":"SPINTEX MAIN","code":"30121","bank_id":6},{"name":"KEJETIA","code":"30628","bank_id":6},{"name":"AIRPORT CITY","code":"30136","bank_id":6},{"name":"CAPE COAST","code":"30337","bank_id":6},{"name":"KROFOM","code":"30680","bank_id":6},{"name":"DIRECT SALES","code":"30149","bank_id":6},{"name":"HEAD OFFICE","code":"30164","bank_id":6},{"name":"TARKWA","code":"30434","bank_id":6},{"name":"KNUTSFORD AVENUE","code":"30122","bank_id":6},{"name":"MAKOLA SQUARE","code":"30135","bank_id":6},{"name":"GNPC","code":"30108","bank_id":6},{"name":"TESHIE NUNGUA","code":"30168","bank_id":6},{"name":"MAAMOBI","code":"30191","bank_id":6},{"name":"HIGH STREET","code":"30431","bank_id":6},{"name":"TEMA OIL REFINERY","code":"30189","bank_id":6},{"name":"KASOA","code":"30101","bank_id":6},{"name":"NORTH KANESHIE","code":"30190","bank_id":6},{"name":"ADUM","code":"30666","bank_id":6},{"name":"GOASO","code":"30759","bank_id":6},{"name":"MADINA","code":"30163","bank_id":6},{"name":"ELUBO","code":"30498","bank_id":6},{"name":"ASAFO","code":"30623","bank_id":6},{"name":"ASHAIMAN","code":"30184","bank_id":6},{"name":"ODA","code":"30246","bank_id":6},{"name":"DOME","code":"30170","bank_id":6},{"name":"HIGH STREET","code":"30148","bank_id":6},{"name":"LEGON","code":"30110","bank_id":6},{"name":"TARKWA MINES","code":"30451","bank_id":6},{"name":"DANSOMAN","code":"30107","bank_id":6},{"name":"HAATSO","code":"30185","bank_id":6},{"name":"PALM WINE JUNCTION","code":"30197","bank_id":6},{"name":"ADENTA","code":"30194","bank_id":6},{"name":"INDEPENDENCE AVENUE","code":"30175","bank_id":6},{"name":"BANTAMA","code":"30674","bank_id":6},{"name":"BOLGATANGA","code":"30919","bank_id":6},{"name":"RING ROAD CENTRAL","code":"30114","bank_id":6},{"name":"ATEBUBU","code":"30778","bank_id":6},{"name":"WEIJA","code":"30179","bank_id":6},{"name":"ASANKRAGUA","code":"30452","bank_id":6},{"name":"OSU","code":"30112","bank_id":6},{"name":"SEFWI","code":"30676","bank_id":6},{"name":"DARKUMAN","code":"30173","bank_id":6},{"name":"NIMA","code":"30109","bank_id":6},{"name":"AFLAO","code":"30572","bank_id":6},{"name":"SOMANYA","code":"30186","bank_id":6},{"name":"BEREKUM","code":"30723","bank_id":6},{"name":"KOFORIDUA","code":"30242","bank_id":6},{"name":"UNDP","code":"30155","bank_id":6},{"name":"TANOSO","code":"30681","bank_id":6},{"name":"TEMA FISHING HARBOUR","code":"30130","bank_id":6},{"name":"WA","code":"31088","bank_id":6},{"name":"TEMA MAIN","code":"30160","bank_id":6},{"name":"OFFSHORE BANKING","code":"30192","bank_id":6},{"name":"NSAWAM","code":"30247","bank_id":6},{"name":"CIRCLE","code":"30141","bank_id":6},{"name":"AGBOBLOSHIE","code":"30162","bank_id":6},{"name":"MOTORWAY EXT","code":"30117","bank_id":6},{"name":"NKAWKAW","code":"30243","bank_id":6},{"name":"ACCRA CORPORATE SERVICE CENTR","code":"30144","bank_id":6},{"name":"TEPA","code":"30771","bank_id":6},{"name":"WINNEBA","code":"30165","bank_id":6},{"name":"KANESHIE","code":"30187","bank_id":6},{"name":"TWIFO PRASO","code":"30399","bank_id":6},{"name":"LIBERATION ROAD","code":"30432","bank_id":6},{"name":"SUNYANI","code":"30750","bank_id":6},{"name":"AVENUE CENTRAL","code":"30154","bank_id":6},{"name":"BAWKU","code":"30926","bank_id":6},{"name":"TAKORADI KOKOMPE","code":"30456","bank_id":6},{"name":"ABEKA LAPAZ","code":"30106","bank_id":6},{"name":"TAMALE","code":"30833","bank_id":6},{"name":"HEAD OFFICE","code":"260101","bank_id":7},{"name":"MICHEL CAMP","code":"210106","bank_id":8},{"name":"NEWTOWN","code":"210105","bank_id":8},{"name":"KUMASI","code":"210602","bank_id":8},{"name":"KUMASI AMAKOM","code":"210601","bank_id":8},{"name":"MAAMOBI","code":"210103","bank_id":8},{"name":"OSU","code":"210113","bank_id":8},{"name":"TAKORADI","code":"210401","bank_id":8},{"name":"TAMALE","code":"210801","bank_id":8},{"name":"ACCRA CENTRAL","code":"210104","bank_id":8},{"name":"HEAD OFFICE","code":"210100","bank_id":8},{"name":"MULTICREDIT SAVINGS AND LOANS CO.","code":"210699","bank_id":8},{"name":"EAST LEGON","code":"210111","bank_id":8},{"name":"TEMA","code":"210116","bank_id":8},{"name":"SPINTEX ROAD","code":"210114","bank_id":8},{"name":"MADINA","code":"210118","bank_id":8},{"name":"KWASHIEMAN","code":"210112","bank_id":8},{"name":"DANSOMAN","code":"210117","bank_id":8},{"name":"FARRAR","code":"210101","bank_id":8},{"name":"ABOSSEY OKAI","code":"210119","bank_id":8},{"name":"RIDGE","code":"210102","bank_id":8},{"name":"SEFWI BOAKO","code":"10402","bank_id":9},{"name":"TAKORADI","code":"10401","bank_id":9},{"name":"AGONA SWEDRU","code":"10303","bank_id":9},{"name":"SUNYANI","code":"10701","bank_id":9},{"name":"HOHOE","code":"11101","bank_id":9},{"name":"","code":"10101","bank_id":9},{"name":"KUMASI","code":"10601","bank_id":9},{"name":"TAMALE","code":"10801","bank_id":9},{"name":"SPINTEX","code":"270103","bank_id":10},{"name":"MADINA","code":"270106","bank_id":10},{"name":"KUMASI","code":"270601","bank_id":10},{"name":"ACCRA CENTRAL","code":"270102","bank_id":10},{"name":"DARKUMAN","code":"270108","bank_id":10},{"name":"TAKORADI","code":"270401","bank_id":10},{"name":"NIMA","code":"270104","bank_id":10},{"name":"ADABRAKA","code":"270101","bank_id":10},{"name":"NORTH INDUSTRIAL AREA","code":"270105","bank_id":10},{"name":"HEAD OFFICE","code":"270100","bank_id":10},{"name":"TEMA","code":"270107","bank_id":10},{"name":"ASAFO","code":"140605","bank_id":11},{"name":"CIRCLE BRANCH","code":"140108","bank_id":11},{"name":"SPINTEX ROAD","code":"140104","bank_id":11},{"name":"GRAPHIC ROAD","code":"140105","bank_id":11},{"name":"TEMA","code":"140102","bank_id":11},{"name":"HEAD OFFICE","code":"140100","bank_id":11},{"name":"WEIJA BRANCH","code":"140107","bank_id":11},{"name":"OPPORTUNITY SAVINGS & LOANS","code":"140199","bank_id":11},{"name":"SUAME","code":"140602","bank_id":11},{"name":"KEJETIA","code":"140603","bank_id":11},{"name":"TARKWA","code":"140402","bank_id":11},{"name":"NHYIEASO","code":"140601","bank_id":11},{"name":"LEGON","code":"140109","bank_id":11},{"name":"KNUST","code":"140604","bank_id":11},{"name":"DERBY AVENUE","code":"140103","bank_id":11},{"name":"INDEPENDENCE AVENUE","code":"140101","bank_id":11},{"name":"TEMA HARBOUR","code":"140106","bank_id":11},{"name":"TAKORADI HARBOUR","code":"140403","bank_id":11},{"name":"RING ROAD CENTRAL","code":"140110","bank_id":11},{"name":"TAKORADI","code":"140401","bank_id":11},{"name":"SPINTEX","code":"130117","bank_id":12},{"name":"WOMEN'S WORLD BANKING","code":"130157","bank_id":12},{"name":"BURMA CAMP","code":"130130","bank_id":12},{"name":"KASOA BRANCH","code":"130135","bank_id":12},{"name":"DARKUMAN","code":"130114","bank_id":12},{"name":"TAFO","code":"130606","bank_id":12},{"name":"TARKWA","code":"130402","bank_id":12},{"name":"KENYASI AGENCY","code":"130701","bank_id":12},{"name":"TRUST TOWERS BRANCH","code":"130132","bank_id":12},{"name":"HOSPITAL ROAD BRANCH","code":"130134","bank_id":12},{"name":"MADINA CENTRAL BRANCH","code":"130137","bank_id":12},{"name":"ADUM","code":"130604","bank_id":12},{"name":"ELUBU","code":"130404","bank_id":12},{"name":"JUBILEE HOUSE","code":"130602","bank_id":12},{"name":"TEMA LONG ROOM","code":"130108","bank_id":12},{"name":"SOUTH INDUSTRIAL AREA(SIA)","code":"130116","bank_id":12},{"name":"TAKORADI MARKET CIRCLE","code":"130403","bank_id":12},{"name":"COMMUNITY1 BRANCH","code":"130138","bank_id":12},{"name":"OSU","code":"130106","bank_id":12},{"name":"DOME ST. JOHNS","code":"130126","bank_id":12},{"name":"RING ROAD CENTRAL","code":"130103","bank_id":12},{"name":"OKOFO BRANCH","code":"130153","bank_id":12},{"name":"BANTAMA","code":"130610","bank_id":12},{"name":"SAFE BOND","code":"130128","bank_id":12},{"name":"SSNIT HOUSE BRANCH","code":"130614","bank_id":12},{"name":"SILVER STAR","code":"130105","bank_id":12},{"name":"TAKORADI","code":"130401","bank_id":12},{"name":"PROCREDIT SAVINGS & LOANS","code":"130156","bank_id":12},{"name":"SAKUMONO BRANCH","code":"130139","bank_id":12},{"name":"KUMASI HARPER ROAD","code":"130601","bank_id":12},{"name":"DANSOMAN","code":"130112","bank_id":12},{"name":"ASH TOWN","code":"130607","bank_id":12},{"name":"ACCION","code":"130145","bank_id":12},{"name":"KISSEIMAN BRANCH","code":"130142","bank_id":12},{"name":"STADIUM","code":"130611","bank_id":12},{"name":"BUI","code":"130703","bank_id":12},{"name":"BANTAMA GNTC BRANCH","code":"130613","bank_id":12},{"name":"KEJETIA","code":"130608","bank_id":12},{"name":"ACHIMOTA MILE 7","code":"130121","bank_id":12},{"name":"KANTAMANTO BRANCH","code":"130136","bank_id":12},{"name":"FIRST NATIONAL SAVINGS & LOANS","code":"130155","bank_id":12},{"name":"TEMA COMMUNITY 6","code":"130113","bank_id":12},{"name":"UNION SAVINGS & LOANS","code":"130158","bank_id":12},{"name":"ACCRA SHOPPING MALL","code":"130118","bank_id":12},{"name":"NIMA","code":"130110","bank_id":12},{"name":"HEAD OFFICE","code":"130101","bank_id":12},{"name":"HIGH STREET BRANCH","code":"130140","bank_id":12},{"name":"MADINA","code":"130122","bank_id":12},{"name":"SUAME BRANCH","code":"130615","bank_id":12},{"name":"LEGON","code":"130115","bank_id":12},{"name":"TEMA SHOPPING MALL","code":"130119","bank_id":12},{"name":"EAST AIRPORT BRANCH","code":"130147","bank_id":12},{"name":"TUDU","code":"130104","bank_id":12},{"name":"TESANO BRANCH","code":"130133","bank_id":12},{"name":"KWASHIEMAN BRANCH","code":"130141","bank_id":12},{"name":"WESTLANDS","code":"130124","bank_id":12},{"name":"MCCARTHY HILL","code":"130109","bank_id":12},{"name":"HAATSOO","code":"130123","bank_id":12},{"name":"NEW ABIREM","code":"130201","bank_id":12},{"name":"OPPORTUNITY INT. SAVINGS AND LOAN","code":"130146","bank_id":12},{"name":"LABONE","code":"130129","bank_id":12},{"name":"ABREPO JUNCTION","code":"130605","bank_id":12},{"name":"MOTOR WAY ROUNDABOUT","code":"130125","bank_id":12},{"name":"TEMA","code":"130102","bank_id":12},{"name":"REINSURANCE HOUSE BRANCH","code":"130131","bank_id":12},{"name":"TAMALE","code":"130801","bank_id":12},{"name":"EVANDY HOSTEL BRANCH","code":"130151","bank_id":12},{"name":"AFLAO","code":"130501","bank_id":12},{"name":"KNUST","code":"130603","bank_id":12},{"name":"SUNYANI","code":"130702","bank_id":12},{"name":"ADEHYEMAN SAVINGS & LOAN","code":"130154","bank_id":12},{"name":"ASHTOWN EAST BRANCH","code":"130616","bank_id":12},{"name":"PENTAGON LEGON BRANCH","code":"130152","bank_id":12},{"name":"KWABENYA BRANCH","code":"130148","bank_id":12},{"name":"BEIGE CAPITAL","code":"130160","bank_id":12},{"name":"FIRST ALLIED SAVINGS & LOANS","code":"130159","bank_id":12},{"name":"A AND C","code":"130107","bank_id":12},{"name":"TANOSO","code":"130612","bank_id":12},{"name":"KOTOBABI","code":"130127","bank_id":12},{"name":"ASHAIMAN","code":"130150","bank_id":12},{"name":"OKPONGLO BRANCH","code":"130149","bank_id":12},{"name":"ABREPO MAIN","code":"130609","bank_id":12},{"name":"WEIJA","code":"130120","bank_id":12},{"name":"ABEKA LAPAZ","code":"130111","bank_id":12},{"name":"","code":"290101","bank_id":13},{"name":"KANTAMANTO AGENCY","code":"170102","bank_id":14},{"name":"SUAME","code":"170602","bank_id":14},{"name":"NORTH RIDGE","code":"170105","bank_id":14},{"name":"ACCRA","code":"170101","bank_id":14},{"name":"TEMA","code":"170103","bank_id":14},{"name":"MAKOLA","code":"170104","bank_id":14},{"name":"KUMASI","code":"170601","bank_id":14},{"name":"SPINTEX","code":"20111","bank_id":15},{"name":"TESANO BRANCH","code":"","bank_id":15},{"name":"ACCRA CENTRAL BRANCH","code":"","bank_id":15},{"name":"DANSOMAN BRANCH","code":"","bank_id":15},{"name":"NEWTOWN BRANCH","code":"","bank_id":15},{"name":"OSU BRANCH","code":"","bank_id":15},{"name":"SUNYANI POSTBANK","code":"240701","bank_id":16},{"name":"SPINTEX ROAD","code":"240102","bank_id":16},{"name":"RIDGE TOWERS","code":"240101","bank_id":16},{"name":"OSU","code":"240104","bank_id":16},{"name":"ACCRA CENTRAL POSTBANK","code":"240117","bank_id":16},{"name":"A AND C MALL","code":"240112","bank_id":16},{"name":"ATONSU","code":"240604","bank_id":16},{"name":"DZORWULU","code":"240122","bank_id":16},{"name":"KUMASI","code":"240603","bank_id":16},{"name":"RING ROAD","code":"240114","bank_id":16},{"name":"HO","code":"240501","bank_id":16},{"name":"ADENTA","code":"240118","bank_id":16},{"name":"TEMA SAFE BOND","code":"240106","bank_id":16},{"name":"BOLGATANGA POSTBANK","code":"240901","bank_id":16},{"name":"TAKORADI POSTBANK","code":"240403","bank_id":16},{"name":"KANTAMANTO","code":"240107","bank_id":16},{"name":"TEMA","code":"240109","bank_id":16},{"name":"ACTION CHAPEL","code":"240111","bank_id":16},{"name":"HIGH STREET","code":"240103","bank_id":16},{"name":"KUMASI","code":"240602","bank_id":16},{"name":"MAMPROBI POSTBANK","code":"240123","bank_id":16},{"name":"STADIUM POST","code":"240601","bank_id":16},{"name":"KUMASI ADUM POSTBANK","code":"240606","bank_id":16},{"name":"ASSIN FOSU","code":"240301","bank_id":16},{"name":"TAMALE","code":"240801","bank_id":16},{"name":"OKAISHIE","code":"240110","bank_id":16},{"name":"HAATSO","code":"240115","bank_id":16},{"name":"KWAME NKRUMAH AVENUE","code":"240124","bank_id":16},{"name":"AHODWO","code":"240605","bank_id":16},{"name":"ABOSSEY OKAI","code":"240105","bank_id":16},{"name":"TRADE FAIR LA","code":"240120","bank_id":16},{"name":"HOHOE","code":"240191","bank_id":16},{"name":"TAKORADI MARKET CIRCLE","code":"240401","bank_id":16},{"name":"DANSOMAN","code":"240113","bank_id":16},{"name":"TUDU","code":"240108","bank_id":16},{"name":"TARKWA","code":"240402","bank_id":16},{"name":"TESANO","code":"240121","bank_id":16},{"name":"HEAD OFFICE","code":"240100","bank_id":16},{"name":"TEMA COMMUNITY 2","code":"240116","bank_id":16},{"name":"IPS","code":"240119","bank_id":16},{"name":"DOME (KWABENYA)","code":"40144","bank_id":17},{"name":"SUHUM","code":"40208","bank_id":17},{"name":"ASHAIMAN","code":"40121","bank_id":17},{"name":"NKAWIE","code":"40623","bank_id":17},{"name":"KEJETIA","code":"40604","bank_id":17},{"name":"SAMPA","code":"40723","bank_id":17},{"name":"MANKESSIM","code":"40307","bank_id":17},{"name":"TAKORADI HARBOUR","code":"40402","bank_id":17},{"name":"EJISU","code":"40612","bank_id":17},{"name":"NKWANTA","code":"41106","bank_id":17},{"name":"NSAWAM","code":"40134","bank_id":17},{"name":"KOFORIDUA","code":"40201","bank_id":17},{"name":"LIBERTY HOUSE","code":"40117","bank_id":17},{"name":"MPRAESO","code":"40210","bank_id":17},{"name":"BEKWAI","code":"40609","bank_id":17},{"name":"AXIM","code":"40408","bank_id":17},{"name":"DAMBAI","code":"41108","bank_id":17},{"name":"TAKORADI MARKET CIRCLE","code":"40403","bank_id":17},{"name":"MAMPONGASHANTI","code":"40607","bank_id":17},{"name":"ELUBO","code":"40415","bank_id":17},{"name":"HO MARKET","code":"40526","bank_id":17},{"name":"TEMA FISHING HARBOUR","code":"40110","bank_id":17},{"name":"RING ROAD WEST","code":"40111","bank_id":17},{"name":"TECHIMAN MARKET","code":"40724","bank_id":17},{"name":"SOGAKOPE","code":"40142","bank_id":17},{"name":"PEKI","code":"41105","bank_id":17},{"name":"ANYINAM","code":"40207","bank_id":17},{"name":"CLEARING","code":"40125","bank_id":17},{"name":"HO POLYTECHNIC","code":"40530","bank_id":17},{"name":"TAMALE MARKET","code":"40805","bank_id":17},{"name":"KETEKRACHI","code":"41107","bank_id":17},{"name":"ASSIN FOSU","code":"40303","bank_id":17},{"name":"TEPA","code":"40615","bank_id":17},{"name":"DZODZE","code":"40503","bank_id":17},{"name":"BREMAN ASIKUMA","code":"40304","bank_id":17},{"name":"BOGOSO","code":"40414","bank_id":17},{"name":"YENDI","code":"40802","bank_id":17},{"name":"BOLGATANGA","code":"40901","bank_id":17},{"name":"31ST DECEMBER MARKET","code":"40124","bank_id":17},{"name":"AFLAO","code":"40502","bank_id":17},{"name":"YEJI","code":"40606","bank_id":17},{"name":"TANTRA HILL","code":"40130","bank_id":17},{"name":"AGOGO","code":"40622","bank_id":17},{"name":"TEMA INDUSTRIAL AREA","code":"40109","bank_id":17},{"name":"TARKWA","code":"40405","bank_id":17},{"name":"KADJEBI","code":"41103","bank_id":17},{"name":"ELMINA","code":"40315","bank_id":17},{"name":"KADE","code":"40203","bank_id":17},{"name":"NEW EDUBIASE","code":"40618","bank_id":17},{"name":"TECH JUNCTION,KUMASI","code":"40628","bank_id":17},{"name":"MADINA","code":"40123","bank_id":17},{"name":"ABELENKPE","code":"40145","bank_id":17},{"name":"HALFASSINI","code":"40409","bank_id":17},{"name":"UNIVERSITY OF CAPE COAST","code":"40302","bank_id":17},{"name":"NEW TAFO","code":"40204","bank_id":17},{"name":"DUNKWA","code":"40624","bank_id":17},{"name":"LEGON","code":"40103","bank_id":17},{"name":"KNUST KUMASI","code":"40603","bank_id":17},{"name":"BECHEM","code":"40702","bank_id":17},{"name":"EFFIDUASEASHANTI","code":"40610","bank_id":17},{"name":"HO","code":"40501","bank_id":17},{"name":"NUNGUA","code":"40160","bank_id":17},{"name":"AKROPONGAKWAPIM","code":"40132","bank_id":17},{"name":"NIMA BRANCH","code":"40159","bank_id":17},{"name":"SUNYANI","code":"40701","bank_id":17},{"name":"AKUSE","code":"40136","bank_id":17},{"name":"JUASO","code":"40617","bank_id":17},{"name":"NKORANZA","code":"40713","bank_id":17},{"name":"KORLEBU","code":"40113","bank_id":17},{"name":"DAMONGO","code":"40803","bank_id":17},{"name":"SPINTEX ROAD","code":"40150","bank_id":17},{"name":"SAFE BOND (JUBILEE) TEMA","code":"40146","bank_id":17},{"name":"ENCHI","code":"40407","bank_id":17},{"name":"ACCRA NEW TOWN","code":"40118","bank_id":17},{"name":"WINNEBA","code":"40138","bank_id":17},{"name":"TETTEH QUARSHIE CIRCLE","code":"40126","bank_id":17},{"name":"ABOR","code":"40504","bank_id":17},{"name":"KIBI","code":"40209","bank_id":17},{"name":"TAMALE HOSPITAL ROAD","code":"40809","bank_id":17},{"name":"NAVRONGO","code":"40902","bank_id":17},{"name":"BANTAMA","code":"40627","bank_id":17},{"name":"JAPEKROM","code":"40710","bank_id":17},{"name":"AHINSANKUMASI","code":"40619","bank_id":17},{"name":"SEKONDI","code":"40404","bank_id":17},{"name":"JUBILEE HOUSE","code":"40621","bank_id":17},{"name":"ADA FOAH","code":"40140","bank_id":17},{"name":"AKOSOMBO","code":"40135","bank_id":17},{"name":"OSU","code":"40114","bank_id":17},{"name":"KASOA","code":"40143","bank_id":17},{"name":"ACCRA NORTH CIRCLE","code":"40151","bank_id":17},{"name":"BIMBILA","code":"40806","bank_id":17},{"name":"AGONAASHANTI","code":"40620","bank_id":17},{"name":"BAWKU","code":"40903","bank_id":17},{"name":"KASOA MAIN","code":"40147","bank_id":17},{"name":"SEFWI WIAWSO","code":"40608","bank_id":17},{"name":"REPUBLIC HOUSE","code":"40106","bank_id":17},{"name":"KUMASI MAIN","code":"40601","bank_id":17},{"name":"ASAFO MARKET","code":"40602","bank_id":17},{"name":"MAMPONGAKWAPIM","code":"40133","bank_id":17},{"name":"DONKORKROM","code":"40211","bank_id":17},{"name":"GOASO","code":"40707","bank_id":17},{"name":"ASAMANKESE","code":"40206","bank_id":17},{"name":"KWAME NKRUMAH CIRCLE","code":"40127","bank_id":17},{"name":"ADENTA MARKET","code":"40149","bank_id":17},{"name":"PRESTEA","code":"40410","bank_id":17},{"name":"JASIKAN","code":"41102","bank_id":17},{"name":"KANESHIE INDUSTRIAL AREA","code":"40120","bank_id":17},{"name":"HEAD OFFICE","code":"40199","bank_id":17},{"name":"TECHIMAN","code":"40715","bank_id":17},{"name":"INTERNATIONAL TRADE FINANCE","code":"40128","bank_id":17},{"name":"LAWRA","code":"41003","bank_id":17},{"name":"KINTAMPO","code":"40712","bank_id":17},{"name":"EJURA","code":"40614","bank_id":17},{"name":"ABURI","code":"40137","bank_id":17},{"name":"TEMA MARKET","code":"40108","bank_id":17},{"name":"BEREKUM","code":"40703","bank_id":17},{"name":"SALTPOND","code":"40306","bank_id":17},{"name":"TAMALE MAIN","code":"40801","bank_id":17},{"name":"SOMANYA","code":"40131","bank_id":17},{"name":"KPANDO","code":"41104","bank_id":17},{"name":"HOHOE","code":"41101","bank_id":17},{"name":"MIM","code":"40709","bank_id":17},{"name":"TWIFO PRASO","code":"40308","bank_id":17},{"name":"KETA","code":"40141","bank_id":17},{"name":"KISSEIMAN","code":"40148","bank_id":17},{"name":"BOUNDARY ROAD","code":"40116","bank_id":17},{"name":"WA","code":"41001","bank_id":17},{"name":"BOGOSO","code":"40412","bank_id":17},{"name":"AKATSI","code":"40517","bank_id":17},{"name":"HWIDIEM","code":"40706","bank_id":17},{"name":"TUMU","code":"41002","bank_id":17},{"name":"WALEWALE","code":"40906","bank_id":17},{"name":"DUAYAWNKWANTA","code":"40705","bank_id":17},{"name":"OBUASI","code":"40611","bank_id":17},{"name":"NKAWKAW","code":"40205","bank_id":17},{"name":"SANKORE","code":"40717","bank_id":17},{"name":"KANESHIE MARKET","code":"40112","bank_id":17},{"name":"BOLE","code":"41004","bank_id":17},{"name":"MINISTRIES","code":"40105","bank_id":17},{"name":"AKIM ODA","code":"40202","bank_id":17},{"name":"CAPE COAST MAIN","code":"40301","bank_id":17},{"name":"TAKORADI MAIN","code":"40401","bank_id":17},{"name":"DANSOMAN","code":"40158","bank_id":17},{"name":"NEW OFFINSO","code":"40613","bank_id":17},{"name":"DORMAA AHENKRO","code":"40704","bank_id":17},{"name":"TEMA MAIN","code":"40107","bank_id":17},{"name":"GLOBAL TRANSFER SERVICES","code":"40129","bank_id":17},{"name":"AGONA SWEDRU","code":"40139","bank_id":17},{"name":"TRADE FAIR SITE","code":"40119","bank_id":17},{"name":"SUNYANI MARKET","code":"40725","bank_id":17},{"name":"HARPER ROAD","code":"40625","bank_id":17},{"name":"HIGH STREET","code":"40101","bank_id":17},{"name":"AKUMADAN","code":"40616","bank_id":17},{"name":"SAMREBOI","code":"40406","bank_id":17},{"name":"WENCHI","code":"40711","bank_id":17},{"name":"KONONGO","code":"40605","bank_id":17},{"name":"DADIESO","code":"40413","bank_id":17},{"name":"SALAGA","code":"40804","bank_id":17},{"name":"BURMA CAMP","code":"40102","bank_id":17},{"name":"ABURA DUNKWA","code":"40305","bank_id":17},{"name":"DERBY AVENUE","code":"40115","bank_id":17},{"name":"","code":"","bank_id":18},{"name":"COMMUNITY 6","code":"230113","bank_id":19},{"name":"TECHIMAN","code":"230701","bank_id":19},{"name":"OSU","code":"230104","bank_id":19},{"name":"KUMASI","code":"230601","bank_id":19},{"name":"TAMALE","code":"230801","bank_id":19},{"name":"TARKWA","code":"230402","bank_id":19},{"name":"SPINTEX ROAD","code":"230105","bank_id":19},{"name":"OPERA SQUARE","code":"230114","bank_id":19},{"name":"TEMA","code":"230103","bank_id":19},{"name":"GRAPHIC ROAD","code":"230107","bank_id":19},{"name":"LAPAZ","code":"230115","bank_id":19},{"name":"TUDU","code":"230109","bank_id":19},{"name":"LABONE","code":"230106","bank_id":19},{"name":"HEAD OFFICE","code":"230101","bank_id":19},{"name":"MADINA","code":"230110","bank_id":19},{"name":"ACHIMOTA","code":"230111","bank_id":19},{"name":"AFLAO","code":"230501","bank_id":19},{"name":"TAKORADI","code":"230401","bank_id":19},{"name":"NIA","code":"230112","bank_id":19},{"name":"AIRPORT","code":"230102","bank_id":19},{"name":"ASHIAMAN","code":"230108","bank_id":19},{"name":"ASHIAMAN","code":"110118","bank_id":20},{"name":"WINNEBA","code":"110304","bank_id":20},{"name":"KUMASI MAGAZINE","code":"110604","bank_id":20},{"name":"PRIVATE BANKING","code":"110117","bank_id":20},{"name":"KOFORIDUA","code":"110215","bank_id":20},{"name":"TAMALE","code":"110814","bank_id":20},{"name":"TUDU","code":"110109","bank_id":20},{"name":"AGBOGBLOSHIE","code":"110112","bank_id":20},{"name":"ACCRA CENTRAL","code":"110103","bank_id":20},{"name":"TECHIMAN","code":"110710","bank_id":20},{"name":"BAATSONA","code":"110116","bank_id":20},{"name":"POST OFFICE SQUARE","code":"110119","bank_id":20},{"name":"ADUM","code":"110603","bank_id":20},{"name":"ASAMANKESE","code":"110216","bank_id":20},{"name":"ABOSEY OKAI","code":"110108","bank_id":20},{"name":"EBANKESE","code":"110101","bank_id":20},{"name":"KNUST","code":"110613","bank_id":20},{"name":"LEGON","code":"110107","bank_id":20},{"name":"KUMASI","code":"110601","bank_id":20},{"name":"TAKORADI","code":"110401","bank_id":20},{"name":"TEMA","code":"110105","bank_id":20},{"name":"SWEDRU","code":"110302","bank_id":20},{"name":"RIDGE","code":"110104","bank_id":20},{"name":"CAPE COAST","code":"110303","bank_id":20},{"name":"ACHIMOTA","code":"200109","bank_id":21},{"name":"TAKORADI","code":"200401","bank_id":21},{"name":"SWEDRU","code":"200108","bank_id":21},{"name":"KASOA","code":"200102","bank_id":21},{"name":"ADUM","code":"200601","bank_id":21},{"name":"MAKOLA","code":"200101","bank_id":21},{"name":"KORLE","code":"200111","bank_id":21},{"name":"SWANMILL","code":"200110","bank_id":21},{"name":"SPINTEX ROAD","code":"200107","bank_id":21},{"name":"TECHIMAN","code":"200701","bank_id":21},{"name":"RING ROAD CENTRAL","code":"200105","bank_id":21},{"name":"SUAME","code":"200602","bank_id":21},{"name":"DOME","code":"200112","bank_id":21},{"name":"TEMA","code":"200103","bank_id":21},{"name":"SANTA MARIA","code":"200113","bank_id":21},{"name":"KANESHIE","code":"200104","bank_id":21},{"name":"DANSOMAN","code":"200106","bank_id":21},{"name":"NORTH INDUSTIAL AREA","code":"250113","bank_id":22},{"name":"ACHIMOTA","code":"250121","bank_id":22},{"name":"OSU","code":"250101","bank_id":22},{"name":"TECHIMAN","code":"250719","bank_id":22},{"name":"MADINA","code":"250106","bank_id":22},{"name":"KANESHIE POST OFF","code":"250115","bank_id":22},{"name":"KANESHIE","code":"250104","bank_id":22},{"name":"TEMA INDUST. AREA","code":"250125","bank_id":22},{"name":"CASTLE ROAD","code":"250105","bank_id":22},{"name":"ASHAIMAN","code":"250118","bank_id":22},{"name":"TAMALE","code":"250808","bank_id":22},{"name":"SUAME","code":"250610","bank_id":22},{"name":"TEMA","code":"250103","bank_id":22},{"name":"KANTAMANTO","code":"250102","bank_id":22},{"name":"IPS","code":"250120","bank_id":22},{"name":"TARKWA","code":"250411","bank_id":22},{"name":"AMAKOM","code":"250624","bank_id":22},{"name":"AGBOGBLOSHIE","code":"250107","bank_id":22},{"name":"ADUM","code":"250609","bank_id":22},{"name":"HEAD OFFICE","code":"250100","bank_id":22},{"name":"SEFWI WIAWSO","code":"250426","bank_id":22},{"name":"TEMA COMMUNITY 1","code":"250122","bank_id":22},{"name":"TAKORADI","code":"250412","bank_id":22},{"name":"NIMA","code":"250123","bank_id":22},{"name":"RING ROAD CENTRAL","code":"250114","bank_id":22},{"name":"OKAISHIE","code":"250117","bank_id":22},{"name":"ABAKA LAPAZ","code":"250116","bank_id":22},{"name":"ASAFO","code":"100603","bank_id":23},{"name":"ACCRA","code":"100101","bank_id":23},{"name":"KOFORIDUA","code":"100204","bank_id":23},{"name":"BIBIANI","code":"100602","bank_id":23},{"name":"BANTAMA","code":"100604","bank_id":23},{"name":"FIRST NATATIONAL S&L","code":"100199","bank_id":23},{"name":"TEMA EAST","code":"100108","bank_id":23},{"name":"RIDGE","code":"100103","bank_id":23},{"name":"KANESHIE","code":"100105","bank_id":23},{"name":"TECHIMAN","code":"100701","bank_id":23},{"name":"OSU","code":"100112","bank_id":23},{"name":"KUMASI","code":"100601","bank_id":23},{"name":"ADABRAKA","code":"100104","bank_id":23},{"name":"ABEKA BRANCH","code":"100106","bank_id":23},{"name":"ABOSEY OKAI","code":"100110","bank_id":23},{"name":"ACHIMOTA","code":"100109","bank_id":23},{"name":"TARKWA","code":"100402","bank_id":23},{"name":"SOUTH INDUSTRIAL AREA","code":"100111","bank_id":23},{"name":"TEMA","code":"100102","bank_id":23},{"name":"NORTH INDUSTRIAL","code":"100107","bank_id":23},{"name":"ADUM","code":"100605","bank_id":23},{"name":"TAKORADI","code":"100401","bank_id":23},{"name":"AKIM ODA","code":"50218","bank_id":24},{"name":"TECHIMAN","code":"50715","bank_id":24},{"name":"NORTH INDUSTRIAL AREA","code":"50128","bank_id":24},{"name":"TAMALE","code":"50808","bank_id":24},{"name":"WINNEBA ROAD","code":"50124","bank_id":24},{"name":"FOREIGN","code":"50112","bank_id":24},{"name":"TEMA MAIN","code":"50109","bank_id":24},{"name":"OBUASI","code":"50621","bank_id":24},{"name":"BOLGATANGA","code":"50902","bank_id":24},{"name":"TEMA HABOUR AREA(AFKO)","code":"50113","bank_id":24},{"name":"ADENTA","code":"50122","bank_id":24},{"name":"KUMASI","code":"50605","bank_id":24},{"name":"CLEARING UNIT","code":"50120","bank_id":24},{"name":"HO","code":"50503","bank_id":24},{"name":"KOFORIDUA","code":"50204","bank_id":24},{"name":"KUMASI CENTRAL","code":"50619","bank_id":24},{"name":"DANSOMAN","code":"50132","bank_id":24},{"name":"TEMA COMMUNITY 9","code":"50129","bank_id":24},{"name":"WENCHI","code":"50725","bank_id":24},{"name":"LOTTERIES","code":"50116","bank_id":24},{"name":"OSU","code":"50111","bank_id":24},{"name":"ABEKA","code":"50117","bank_id":24},{"name":"SUNYANI","code":"50706","bank_id":24},{"name":"NTOROSO","code":"50730","bank_id":24},{"name":"KINTAMPO","code":"50726","bank_id":24},{"name":"WA","code":"51014","bank_id":24},{"name":"TAKORADI","code":"50407","bank_id":24},{"name":"DUNKWA ON","code":"50327","bank_id":24},{"name":"SPINTEX","code":"50123","bank_id":24},{"name":"CAPE COAST","code":"50310","bank_id":24},{"name":"ACCRA MAIN","code":"50101","bank_id":24},{"name":"HEAD OFFICE","code":"50131","bank_id":24},{"name":"KWAME NKRUMAH CIRCLE","code":"180119","bank_id":25},{"name":"ATONSU","code":"180605","bank_id":25},{"name":"MAKOLA","code":"180107","bank_id":25},{"name":"TAMALE","code":"180801","bank_id":25},{"name":"TEMA FISHING HABOUR","code":"180104","bank_id":25},{"name":"SPINTEX ROAD","code":"180110","bank_id":25},{"name":"SUAME MAAKRO","code":"180606","bank_id":25},{"name":"CAPECOAST BRANCH","code":"180301","bank_id":25},{"name":"ABOABO","code":"180604","bank_id":25},{"name":"MADINA","code":"180105","bank_id":25},{"name":"TAKORADI HARBOUR","code":"180401","bank_id":25},{"name":"ABEKA","code":"180116","bank_id":25},{"name":"TAKORADI MARKET CIRCLE","code":"180402","bank_id":25},{"name":"ACCRA","code":"180101","bank_id":25},{"name":"TEMA COMMUNITY 1","code":"180111","bank_id":25},{"name":"GICEL","code":"180103","bank_id":25},{"name":"RING ROAD CENTRAL","code":"180109","bank_id":25},{"name":"NORTH INDUSTRIAL AREA","code":"180117","bank_id":25},{"name":"UNIV. OF CAPE COAST BRANCH","code":"180302","bank_id":25},{"name":"AFFUL NKWANTA","code":"180603","bank_id":25},{"name":"ADENTA","code":"180118","bank_id":25},{"name":"ODORKOR","code":"180115","bank_id":25},{"name":"ZONGO JUNCTION","code":"180114","bank_id":25},{"name":"KUMASI","code":"180601","bank_id":25},{"name":"MATAHEKO","code":"180120","bank_id":25},{"name":"TESANO","code":"180113","bank_id":25},{"name":"ABOSSEY OKAI","code":"180102","bank_id":25},{"name":"ADUM","code":"180602","bank_id":25},{"name":"WEIJA","code":"180112","bank_id":25},{"name":"OBUASI","code":"20617","bank_id":26},{"name":"LEGON","code":"20108","bank_id":26},{"name":"TAKORADI HARBOUR","code":"20422","bank_id":26},{"name":"KORLE DUDOR","code":"20103","bank_id":26},{"name":"TEMA","code":"20106","bank_id":26},{"name":"ACHIMOTA","code":"20127","bank_id":26},{"name":"KEJETIA","code":"20613","bank_id":26},{"name":"DANSOMAN","code":"20121","bank_id":26},{"name":"TARKWA","code":"20424","bank_id":26},{"name":"OSU","code":"20112","bank_id":26},{"name":"ABEKA","code":"20126","bank_id":26},{"name":"TAMALE","code":"20823","bank_id":26},{"name":"TUDU","code":"20107","bank_id":26},{"name":"HARPER ROAD","code":"20615","bank_id":26},{"name":"OPEIBEA HOUSE","code":"20105","bank_id":26},{"name":"HIGH STREET","code":"20101","bank_id":26},{"name":"SPINTEX","code":"20118","bank_id":26},{"name":"MADINA","code":"20128","bank_id":26},{"name":"LIBERIA ROAD","code":"20104","bank_id":26},{"name":"TECHIMAN","code":"20720","bank_id":26},{"name":"RING ROAD CENTRAL","code":"20114","bank_id":26},{"name":"Sunyani","code":"0000","bank_id":27},{"name":"ADUM","code":"90601","bank_id":27},{"name":"TEMA FISHING HARBOUR","code":"90110","bank_id":27},{"name":"BOLGATANGA","code":"90901","bank_id":27},{"name":"RING ROAD CENTRAL","code":"90107","bank_id":27},{"name":"TAKORADI","code":"90401","bank_id":27},{"name":"AKIM ODA","code":"90202","bank_id":27},{"name":"SEFWI BEKWAI","code":"90402","bank_id":27},{"name":"ACCRA NEW TOWN","code":"90104","bank_id":27},{"name":"MADINA","code":"90118","bank_id":27},{"name":"HEAD OFFICE","code":"90115","bank_id":27},{"name":"NORTH INDUSTRIAL AREA","code":"90102","bank_id":27},{"name":"KANESHIE","code":"90109","bank_id":27},{"name":"JUABESO","code":"90408","bank_id":27},{"name":"KUMASI CENTRAL","code":"90602","bank_id":27},{"name":"HO","code":"90501","bank_id":27},{"name":"TEMA COMMUNITY TWO","code":"90106","bank_id":27},{"name":"AKONTOMBRA","code":"90407","bank_id":27},{"name":"SPINTEX ROAD","code":"90117","bank_id":27},{"name":"PREMIER TOWERS","code":"90114","bank_id":27},{"name":"KOFORIDUA","code":"90201","bank_id":27},{"name":"TEPA","code":"90604","bank_id":27},{"name":"DUNKWA","code":"90302","bank_id":27},{"name":"BIBIANI","code":"90603","bank_id":27},{"name":"SUNYANI","code":"90701","bank_id":27},{"name":"WA","code":"91001","bank_id":27},{"name":"ADABOKROM","code":"90410","bank_id":27},{"name":"ASANKRAGUA","code":"90406","bank_id":27},{"name":"ACCRA MAIN","code":"90101","bank_id":27},{"name":"ASAFO","code":"90605","bank_id":27},{"name":"KEJETIA","code":"90607","bank_id":27},{"name":"TUDU","code":"90103","bank_id":27},{"name":"SEFWI WIAWSO","code":"90403","bank_id":27},{"name":"BEREKUM","code":"90741","bank_id":27},{"name":"TAMALE","code":"90801","bank_id":27},{"name":"CAPE COAST","code":"90301","bank_id":27},{"name":"FAANOFA","code":"90105","bank_id":27},{"name":"ESSAM","code":"90405","bank_id":27},{"name":"OKAISHIE","code":"90108","bank_id":27},{"name":"TARKWA","code":"90404","bank_id":27},{"name":"ASEMPANEYE","code":"90409","bank_id":27},{"name":"SUAME","code":"90606","bank_id":27},{"name":"KOTOBABI","code":"90111","bank_id":27},{"name":"EAST LEGON","code":"","bank_id":28},{"name":"HO","code":"190501","bank_id":28},{"name":"NORTH INDUSTIAL AREA","code":"190105","bank_id":28},{"name":"KASOA","code":"190112","bank_id":28},{"name":"BOLGATANGA","code":"190901","bank_id":28},{"name":"HARPER","code":"190601","bank_id":28},{"name":"GRAPHIC ROAD","code":"190107","bank_id":28},{"name":"ROMAN RIDGE","code":"190111","bank_id":28},{"name":"ACCRA MAIN","code":"190101","bank_id":28},{"name":"MAKOLA","code":"190108","bank_id":28},{"name":"TEMA INDUSTRIAL AREA","code":"190106","bank_id":28},{"name":"SUNYANI","code":"190701","bank_id":28},{"name":"ACHIMOTA","code":"190110","bank_id":28},{"name":"ACCRA MALL","code":"190104","bank_id":28},{"name":"TEMA FISHING HABOUR","code":"190113","bank_id":28},{"name":"TAKORADI","code":"190401","bank_id":28},{"name":"SPINTEX ROAD","code":"190103","bank_id":28},{"name":"WA","code":"191001","bank_id":28},{"name":"AIRPORT CITY","code":"190102","bank_id":28},{"name":"RIND ROAD","code":"190109","bank_id":28},{"name":"TARKWA","code":"190402","bank_id":28},{"name":"TAMALE","code":"190801","bank_id":28},{"name":"NORTH INDUSTRIAL AREA","code":"300109","bank_id":29},{"name":"EVANDY BRANCH","code":"150131","bank_id":30},{"name":"KWABENYA  BRANCH","code":"150118","bank_id":30},{"name":"WOMEN'S WORLD BANKING","code":"150124","bank_id":30},{"name":"MADINA","code":"150107","bank_id":30},{"name":"OKPONGLO BRANCH","code":"150119","bank_id":30},{"name":"ASHTOWN","code":"150603","bank_id":30},{"name":"ASHIAMAN BRANCH","code":"150130","bank_id":30},{"name":"KANTAMANTO","code":"150106","bank_id":30},{"name":"SPINTEX BRANCH","code":"150117","bank_id":30},{"name":"KISSEIMAN","code":"150116","bank_id":30},{"name":"UNION SAVING & LOANS","code":"150128","bank_id":30},{"name":"TRUST TOWERS BRANCH","code":"150102","bank_id":30},{"name":"TEMA MAIN","code":"150104","bank_id":30},{"name":"ADEHERNAN SAVINGS&LOANS","code":"150120","bank_id":30},{"name":"ACCRA MAIN BRANCH","code":"150101","bank_id":30},{"name":"SAKUMONO","code":"150111","bank_id":30},{"name":"BANTAMA BRANCH","code":"150604","bank_id":30},{"name":"KWASHIEMAN","code":"150115","bank_id":30},{"name":"FIRST NATIONAL SAVINGS&LOANS","code":"150121","bank_id":30},{"name":"TEMA COMMUNITY I","code":"150108","bank_id":30},{"name":"KUMASI MAIN BRANCH","code":"150601","bank_id":30},{"name":"POST OFFICE","code":"150114","bank_id":30},{"name":"KASOA","code":"150105","bank_id":30},{"name":"OKOFO HOUSE","code":"150112","bank_id":30},{"name":"TESANO BRANCH","code":"150103","bank_id":30},{"name":"SUAME MAGAZINE","code":"150602","bank_id":30},{"name":"TAKORADI","code":"60402","bank_id":31},{"name":"DZORWULU 1 MOTORWAY","code":"60108","bank_id":31},{"name":"","code":"60127","bank_id":31},{"name":"EAST LEGON 1","code":"60111","bank_id":31},{"name":"KUMASI","code":"60601","bank_id":31},{"name":"HEAD OFFICE","code":"60101","bank_id":31},{"name":"SPINTEX ROAD","code":"60114","bank_id":31},{"name":"MADINA","code":"60110","bank_id":31}]

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = [{"name":"Ecobank","account_number":"0140004777408","status":"A"},{"name":"Guaranty Trust Bank","account_number":"0140004777422","status":"A"},{"name":"Stanbic Bank","account_number":"0140004777433","status":"A"},{"name":"Cal Bank","account_number":"0140004777444","status":"A"},{"name":"Standard Chartered Bank","account_number":"0140004777455","status":"A"},{"name":"Barclays Bank","account_number":"0140004777466","status":"A"},{"name":"HFC Bank","account_number":"0140004777488","status":"A"},{"name":"Zenith Bank","account_number":"0140004777499","status":"A"}]

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = [{"name":"Drivers License","status":"A"},{"name":"Passport","status":"A"},{"name":"National","status":"A"},{"name":"Voters","status":"A"}]

/***/ })
/******/ ]);
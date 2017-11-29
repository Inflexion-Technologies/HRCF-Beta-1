import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import session from 'express-session';
import expressValidator from 'express-validator';

import UserRoutes from './router/users_router';
import ApproveRoutes from './router/approves_router';
import BanksRoutes from './router/banks_router';
import BranchesRoutes from './router/branches_router';
import CompanysRoutes from './router/companys_router';
import CreditsRoutes from './router/credits_router';
import TransactionsRoutes from './router/transactions_router';
import WithdrawalsRoutes from './router/withdrawals_router';
import AuthRoutes from './router/auth_router';
import BankStatementRoutes from './router/bank_statements_router';
import MiscRoutes from './router/misc_router';
import AccountsRoutes from './router/accounts_router'
import PayoutRoutes from './router/payouts_router';

import UtilsRoutes from './router/utils_router';
import SessionsRouters from './router/session_router';
import UploadRoutes from './router/uploads_router';

import * as models from './models/models';
import * as d from './config';
import request from 'request';

import jwt from 'jsonwebtoken';
import path from 'path';
import json2xls from 'json2xls';
import { setTimeout } from 'timers';
import { port } from '_debugger';

export default class App {

    constructor(){
        this.app = express();
        this.initExpress(this.app);
        this.initSQLAndRouters(this.app);
        this.finalize(this.app);
    }

    initExpress(app){
        app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
        app.use(cookieParser());
        app.use(json2xls.middleware);
        //app.use(expressValidator([]));
        app.use(session({resave:true, saveUninitialized: true, 
                        secret: 'thequickbrownfoxjumpedoverthelazydogs',
                        cookieName: 'session',
                        duration: 30*60*1000, 
                        activeDuration: 5*60*1000, 
                        httpOnly: true, 
                        cookie: {secure: false }}));

        //CORS enabling
        app.use((req, res, next)=>{
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
          next();
        });

        //logging
        app.use(logger('dev'));

        app.use(express.static('build'));

        //Disable cache
        app.use((req, res, next) => {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next();
        });

        app.get('/', (req, res)=>{
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });
    }

    servePages(req, res){
        const app = express();

        res.sendFile('build/index.html' , { root : __dirname});
    }

    validate(req, res, next){
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

        //next();
    }

    initSQLAndRouters(app){
        const dbConfig = d.sequelize;

        //Setting up models
        const approveModel = models.approveModel(dbConfig);
        const bankModel = models.bankModel(dbConfig);
        const branchModel = models.branchModel(dbConfig);

        const companyModel = models.companyModel(dbConfig);
        const creditModel = models.creditModel(dbConfig);
        const transactionModel = models.transactionModel(dbConfig);
        const withdrawalModel = models.withdrawalModel(dbConfig);
        const usersModel = models.usersModel(dbConfig);
        const trackModel = models.trackModel(dbConfig);

        const icBankModel = models.ICBankModel(dbConfig);
        const bankStatementModel = models.bankStatementModel(dbConfig);
        const idTypesModel = models.idModel(dbConfig);
        const accountsModel = models.accountModel(dbConfig);
        const requestModel = models.requestModel(dbConfig);
        const imageMapperModel = models.imageMapModel(dbConfig);
        const payoutModel = models.payoutRequestModel(dbConfig);
        const navStoreModel = models.navStoreModel(dbConfig);
        const forgotModel = models.forgotModel(dbConfig);
        const fundAllocationStoreModel = models.fundAllocationStoreModel(dbConfig);
        const fundAllocationCollectionModel = models.fundAllocationCollectionModel(dbConfig);
        const portfolioModel = models.portfolioModel(dbConfig);

        //Setting relationships
        portfolioModel.belongsTo(usersModel);
        forgotModel.belongsTo(usersModel);
        payoutModel.belongsTo(usersModel);
        payoutModel.belongsTo(accountsModel);
        imageMapperModel.belongsTo(usersModel);

        requestModel.belongsTo(usersModel);
        requestModel.belongsTo(approveModel);
        requestModel.belongsTo(accountsModel);

        fundAllocationCollectionModel.belongsTo(fundAllocationStoreModel);

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

        usersModel.belongsToMany(approveModel, {through: 'user_approvers'});
        approveModel.belongsToMany(usersModel, {through: 'user_approvers'});

        usersModel.belongsToMany(accountsModel, {through: 'user_accounts'});        
        accountsModel.belongsToMany(usersModel, {through: 'user_accounts'});

        usersModel.belongsToMany(portfolioModel, {through: 'user_portfolios'});
        portfolioModel.belongsToMany(usersModel, {through: 'user_portfolios'});

        //Loading Banks and Branches and IC Banks
        const banksData = require('./resources/banks.json');
        const branchesData = require('./resources/bank_branches.json');
        const icBanksData = require('./resources/ic_banks.json');
        const idTypesData = require('./resources/id_types.json');

        if(d.config.prepare){          
            dbConfig.sync().then(()=>{
                trackModel.bulkCreate([{count: 1},{count: 1}]);
                companyModel.bulkCreate([{name : 'Anonymous'}]);
                bankModel.bulkCreate(banksData);
                branchModel.bulkCreate(branchesData);
                icBankModel.bulkCreate(icBanksData);
                idTypesModel.bulkCreate(idTypesData);         
            });
        }
        
        const users = new UserRoutes(usersModel, trackModel, companyModel);
        const approvers = new ApproveRoutes(approveModel);

        const branches = new BranchesRoutes(branchModel);
        const companys = new CompanysRoutes(companyModel, usersModel);
        const credits = new CreditsRoutes(creditModel, bankModel, usersModel);
        const transactions = new TransactionsRoutes(transactionModel, usersModel,requestModel, approveModel, creditModel);
        const withdrawals = new WithdrawalsRoutes(withdrawalModel, usersModel);
        const banks = new BanksRoutes(bankModel);
        
        const utils = new UtilsRoutes(usersModel, trackModel, companyModel, bankModel, branchModel, idTypesModel, requestModel, accountsModel,approveModel, icBankModel, payoutModel, withdrawalModel, transactionModel, forgotModel, fundAllocationStoreModel, fundAllocationCollectionModel, navStoreModel);
        const auth = new AuthRoutes(usersModel);
        const bankstatement = new BankStatementRoutes(bankStatementModel, icBankModel, usersModel);
        const misc = new MiscRoutes(usersModel, accountsModel, approveModel, companyModel);
        const accounts = new AccountsRoutes(accountsModel, branchModel, bankModel, usersModel);
        const uploadStatement = new UploadRoutes();
        const payoutRequest = new PayoutRoutes(payoutModel); 

        //Set Middleware to check for tokens
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
        app.use('/api/v1/payouts', payoutRequest.routes());
        
        app.use('/api/utils', utils.routes());
        app.use('/api/auth', auth.routes());
    }

    finalize(app){
        const PORT = d.config.PORT;
        app.listen(parseInt(PORT), ()=>{
            console.log('Running on PORT ::: '+PORT);
        });

        //Run cron after 1 min
        setTimeout(()=>{
            this.runCron();
        }, 60*1000)
    }

    creditAllUsers(assume_nav){
        const dbConfig = d.sequelize;        
        const usersModel = models.usersModel(dbConfig);
        const creditModel = models.creditModel(dbConfig);
        const transaction = models.transactionModel(dbConfig);

        usersModel.sum('actual_balance', {where :{status : 'A'}}).then((totalActualBalance)=>{
            if(parseFloat(totalActualBalance) > 0){
                const nav = (parseFloat(assume_nav) - parseFloat(totalActualBalance));
                if(nav < 1) return;

                usersModel.findAll({ where : {status : 'A'}}).then((users)=>{
                    users.map((user)=>{
                        const interest = (parseFloat(user.actual_balance)/parseFloat(totalActualBalance))*parseFloat(nav);
                        user.increment({'actual_balance': interest});
                        user.increment({'available_balance': interest})                        
                        .then((user)=>{
                            if(user){
                                creditModel.create({amount : interest, 
                                    type : 'I', 
                                    user_id: user.id, 
                                    narration: 'Interest'});
                                transaction.create({type : 'I', 
                                    amount : interest, 
                                    user_id : user.id, 
                                    narration : 'Interest'});
                            }
                        })
                    })
                })
            }
        })   
    }

    saveNAV(payload){
        const dbConfig = d.sequelize;        
        const navStoreModel = models.navStoreModel(dbConfig);

        //Grab previous data
        navStoreModel.max('id', {where : {status : 'A'}})
        .then((max_id)=>{
            if(max_id){
                navStoreModel.findOne({where : {id : max_id}})
                .then((lastnav)=>{
                    if(lastnav){
                        const chg = parseFloat(payload.nav) / lastnav.nav;
                        const percent_chg = (chg - 1)*100;

                        navStoreModel.create({nav : payload.nav,
                            nav_per_unit : payload.navPerUnit, 
                            gain_loss : payload.gainLoss,
                            per_change : percent_chg});
                    }
                })
            }
        })

        // navStoreModel.create({nav : payload.nav,
        //      nav_per_unit : payload.navPerUnit, 
        //      gain_loss : payload.gainLoss});
    }

    saveFundAllocationData(data){
        const dbConfig = d.sequelize;
        const fundAllocationStoreModel = models.fundAllocationStoreModel(dbConfig);
        const fundAllocationCollectionModel = models.fundAllocationCollectionModel(dbConfig);

        if(data.length > 0){

            fundAllocationStoreModel.create({status : 'A'})
            .then((store)=>{
                if(store){
                    data.map((d)=>{
                        fundAllocationCollectionModel.create({
                            fund_allocation_store_id : store.id,
                            fund_name : d.fundName,
                            market_value : d.marketValue,
                            aum_percent : d.aumPercent,
                            asset_class : d.assetClass
                        })
                    })
                }
            })
        }
    }

    getFundAllocation(){
        var app = this;
        var request = require('request'),
        dateFormat = require('dateformat'),
        //yesterday = new Date().setDate(new Date().getDate()-1),
        today_formatted = dateFormat(new Date(), 'dd-mm-yyyy'),
        url = d.config.ams_fund_allocation;

        console.log('Date => '+url+today_formatted);

        request({
            uri: url+today_formatted,
            method: 'GET',
            json: true,
        }, function(error, res, body){
            console.log("Asset Allocation "+JSON.stringify(body.payload));
            if(body.payload && body.statusCode === 'successful'){
                app.saveFundAllocationData(body.payload);                
            }else{
                console.log('body.payload => '+body.payload);
            }
        });	
    }

    getNAV(){
        var app = this;
        var request = require('request'),
        dateFormat = require('dateformat'),
        //yesterday = new Date().setDate(new Date().getDate()-1),
        today_formatted = dateFormat(new Date(), 'dd-mm-yyyy'),
        url = d.config.ams;

        request({
            uri: url+today_formatted,
            method: 'GET',
            json: true,
        }, function(error, res, body){
            if(body.payload && body.statusCode === 'successful'){
                app.creditAllUsers(body.payload.nav);
                app.saveNAV(body.payload);
            }
            
        });	
    }

    // getNAVHistory(){
        
    //             const previous_days = 21;
        
    //             for(var i = 0; i<previous_days; i++){
        
    //                 var app = this;
    //                 var request = require('request'),
    //                 dateFormat = require('dateformat'),
    //                 yesterday = new Date().setDate(new Date().getDate()-i),
    //                 yesterday_formatted = dateFormat(new Date(yesterday), 'dd-mm-yyyy'),
    //                 url = d.config.ams;
        
    //                 request({
    //                     uri: url+yesterday_formatted,
    //                     method: 'GET',
    //                     json: true,
    //                 }, function(error, res, body){
    //                     if(body.payload && body.statusCode === 'successful'){
    //                         app.creditAllUsers(body.payload.nav);
    //                         app.saveNAV(body.payload);
    //                     }
                        
    //                 });	
    //             }
    // }

    // getFundAllocationHistory(){

    //     const previous_days = 21;
        
    //     for(var i = 0; i < previous_days; i++){
    //         var app = this;
    //         var request = require('request'),
    //         dateFormat = require('dateformat'),
    //         yesterday = new Date().setDate(new Date().getDate()-1),
    //         yesterday_formatted = dateFormat(new Date(yesterday), 'dd-mm-yyyy'),
    //         url = d.config.ams_fund_allocation;

    //         console.log('Date => '+url+yesterday_formatted);

    //         request({
    //             uri: url+yesterday_formatted,
    //             method: 'GET',
    //             json: true,
    //         }, function(error, res, body){
    //             console.log("Asset Allocation "+JSON.stringify(body.payload));
    //             if(body.payload && body.statusCode === 'successful'){
    //                 app.saveFundAllocationData(body.payload);                
    //             }else{
    //                 console.log('body.payload => '+body.payload);
    //             }
    //         });	
    //     }
    // }

    runCron(){
        //First Init
        this.getNAV();
        this.getFundAllocation();

        setInterval(()=>{
            var dateFormat = require('dateformat');
            const hour = dateFormat(new Date(), 'H');

            if(parseInt(hour) === parseInt(d.config.cron_balance_hour)){
                this.getNAV();
                this.getFundAllocation();
            }
            
        }, 60*60*1000);
    }

}

const server = new App();
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

import UtilsRoutes from './router/utils_router';
import SessionsRouters from './router/session_router';
import UploadRoutes from './router/uploads_router';

import * as models from './models/models';
import * as d from './config';
import request from 'request';

import jwt from 'jsonwebtoken';


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
            res.redirect('./index.html');
        });

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

        //Setting relationships

        payoutModel.belongsTo(usersModel);
        payoutModel.belongsTo(accountsModel);

        imageMapperModel.belongsTo(usersModel);

        requestModel.belongsTo(usersModel);
        requestModel.belongsTo(approveModel);
        requestModel.belongsTo(accountsModel);

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


        //Loading Banks and Branches and IC Banks
        const banksData = require('./resources/banks.json');
        const branchesData = require('./resources/bank_branches.json');
        const icBanksData = require('./resources/ic_banks.json');
        const idTypesData = require('./resources/id_types.json');

        // dbConfig.sync().then(()=>{            
        dbConfig.sync({force:true}).then(()=>{
            trackModel.bulkCreate([{count: 1},{count: 1}]);
            companyModel.bulkCreate([{name : 'Anonymous'}]);
            bankModel.bulkCreate(banksData);
            branchModel.bulkCreate(branchesData);
            icBankModel.bulkCreate(icBanksData);
            idTypesModel.bulkCreate(idTypesData);         
        });
        
        const users = new UserRoutes(usersModel, trackModel, companyModel);
        const approvers = new ApproveRoutes(approveModel);

        const branches = new BranchesRoutes(branchModel);
        const companys = new CompanysRoutes(companyModel, usersModel);
        const credits = new CreditsRoutes(creditModel, bankModel, usersModel);
        const transactions = new TransactionsRoutes(transactionModel, usersModel,requestModel, approveModel, creditModel);
        const withdrawals = new WithdrawalsRoutes(withdrawalModel, usersModel);
        const banks = new BanksRoutes(bankModel);
        
        const utils = new UtilsRoutes(usersModel, trackModel, companyModel, bankModel, branchModel, idTypesModel, requestModel, accountsModel,approveModel, icBankModel, payoutModel);
        const auth = new AuthRoutes(usersModel);
        const bankstatement = new BankStatementRoutes(bankStatementModel, icBankModel, usersModel);
        const misc = new MiscRoutes(usersModel, accountsModel, approveModel, companyModel);
        const accounts = new AccountsRoutes(accountsModel, branchModel, bankModel, usersModel);
        const uploadStatement = new UploadRoutes();

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
    }

    finalize(app){
        const PORT = d.config.PORT;
        app.listen(parseInt(PORT), ()=>{
            console.log('Running on PORT ::: '+PORT);
        });
    }

}

const server = new App();
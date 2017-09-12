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

import UtilsRoutes from './router/utils_router';
import SessionsRouters from './router/session_router';

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
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        app.use(cookieParser());
        app.use(expressValidator([]));
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
        

        //Setting relationships
        approveModel.belongsTo(companyModel);

        branchModel.belongsTo(bankModel);

        usersModel.belongsTo(companyModel);

        creditModel.belongsTo(usersModel);
        creditModel.belongsTo(bankModel);

        transactionModel.belongsTo(usersModel);

        withdrawalModel.belongsTo(usersModel);
        withdrawalModel.belongsTo(bankModel);

        usersModel.belongsToMany(approveModel, {through: 'user_approves'});
        usersModel.belongsToMany(branchModel, {through: 'user_branches'});

        //Loading Banks and Branches
        const banksData = require('./banks.json');
        const branchesData = require('./bank_branches.json');

        dbConfig.sync({force:true}).then(()=>{
            trackModel.bulkCreate([{count: 1},{count: 1}]);
            companyModel.bulkCreate([{name : 'Anonymous'}]);
            bankModel.bulkCreate(banksData);
            branchModel.bulkCreate(branchesData);
        });

        const users = new UserRoutes(usersModel, trackModel, companyModel);
        const approvers = new ApproveRoutes(approveModel);

        const branches = new BranchesRoutes(branchModel);
        const companys = new CompanysRoutes(companyModel, usersModel);
        const credits = new CreditsRoutes(creditModel, bankModel, usersModel);
        const transactions = new TransactionsRoutes(transactionModel, usersModel);
        const withdrawals = new WithdrawalsRoutes(withdrawalModel, usersModel);
        const banks = new BanksRoutes(bankModel);
        
        const utils = new UtilsRoutes(usersModel, trackModel, companyModel);
        const auth = new AuthRoutes(usersModel);

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
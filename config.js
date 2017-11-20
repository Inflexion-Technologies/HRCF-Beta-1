var Sequelize = require('sequelize');
var path = require('path');

const config = {
    IP : process.env.SERVER_IP || 'http://104.155.93.65',
    PORT:process.env.SERVER_PORT || 8001,
    secret : 'thequickfoxjumpedofthelazydog',
    uploadlocation : path.resolve(__dirname+'/resources'),
    ext : 'xlsx',
    ams: 'http://217.174.240.226:8080/fam-rest/rest/api/eod?fundCode=ICAMGHRCF&valueDate=',
    ams_fund_allocation : 'http://217.174.240.226:8080/fa-amrest/rest/api/asset-allocations?fundCode=ECGT3SP1&valueDate=',
    cron_balance_hour : 15,
    email_host : 'smtp.gmail.com',
    email_port : '587',
    email_secure : false,
    email_username : 'noreply@icassetmanagers.com',
    email_password : 'dqKZ%388',
    prepare : false
}

const sequelize = new Sequelize(process.env.DB_NAME || 'HRCF', process.env.DB_USER || 'hrcf', process.env.DB_PASSWORD || 'pa55w0rd', {
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

module.exports = {config : config, sequelize : sequelize};
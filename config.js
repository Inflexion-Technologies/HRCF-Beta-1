var Sequelize = require('sequelize');
var path = require('path');

const config = {
    IP : process.env.SERVER_IP || 'http://localhost',
    PORT:process.env.SERVER_PORT || 8001,
    secret : 'thequickfoxjumpedofthelazydog',
    uploadlocation : path.resolve(__dirname+'/resources'),
    ext : 'xlsx'
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


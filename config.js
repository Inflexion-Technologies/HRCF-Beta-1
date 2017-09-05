var Sequelize = require('sequelize');

const config = {
    IP : process.env.SERVER_IP || 'localhost',
    PORT:process.env.SERVER_PORT || 8001, 
}

const sequelize = new Sequelize(process.env.DB_NAME || 'dedup', process.env.DB_USER || 'root', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    //dialect: 'postgres',
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = {config : config, sequelize : sequelize};


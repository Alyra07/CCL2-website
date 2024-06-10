require('dotenv').config();

const mysql= require('mysql2');
const { Sequelize } = require('sequelize');

const config = mysql.createConnection({
    host:"atp.fhstp.ac.at",
    port:8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:"cc231033",
    connectTimeout: 90000
});

config.connect(function(err){
    if(err) throw err;
    console.log('Database connected!');
})

const sequelize = new Sequelize(
    "cc231033",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: "atp.fhstp.ac.at",
        port:8007,
        dialect: "mysql"
    }
);

module.exports = {config, sequelize};

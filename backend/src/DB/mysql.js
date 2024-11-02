const mysql = require('mysql');
const config = require('../config');

// Connection to the database
const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}
let connection;
function handleCon(){
    connection = mysql.createConnection(dbconfig);
    connection.connect((err) => {
        if(err){
            console.error('[db err]', err);
            setTimeout(handleCon, 2000);
        }else{
            console.log('DB Connected');
        }
    });
    connection.on('error', err => {
        console.error('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleCon();
        }else{
            throw err;
        }
    });
}
handleCon();

function allUsers(table){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
function oneUser(table, id){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
function removeUser(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE id = ?`, data.id, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
function insertUser(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
function updateUser(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, data.id], (err, result) => {
            return err ? reject(err) : resolve(result);
        });
    });
}
function addUser(table, data){
    if (data && data.id) {
        return insertUser(table, data);
    } else {
        return updateUser(table, data);
    }
}

module.exports = {
    allUsers,
    oneUser,
    removeUser,
    insertUser,
    updateUser,
    addUser,
};
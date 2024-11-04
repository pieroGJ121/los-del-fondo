const mysql = require('mysql');
const config = require('../config');
const { use } = require('../modules/users/routes');

const dbPool = mysql.createPool({
    connectionLimit: 10,
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        dbPool.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const allUsers = (table) => {
    return query(`SELECT * FROM ??`, [table]);
};
const oneUser = (table, id) => {
    return query(`SELECT * FROM ?? WHERE id = ?`, [table, id]);
};
const removeUser = (table, id) => {
    return query(`DELETE FROM ?? WHERE id = ?`, [table, id]);
};
const insertUser = (table, data) => {
    return query(`INSERT INTO ?? SET ?`, [table, data]);
};
const updateUser = (table, data) => {
    return query(`UPDATE ?? SET ? WHERE id = ?`, [table, data, data.id]);
};
const addUser = async (table, data) => {
    if (data.id) {
        await updateUser(table, data);
        return {user:data};
    } else {
        const result = await insertUser(table, data);
        const newUser = {...data, id: result.insertId};
        return {user:newUser};
    }
};
const findUserByEmail = async(email) =>{
    return query(`SELECT * FROM users WHERE email = ?`, [email]);
}
const loginUser = async(data) =>{
    const user = await findUserByEmail(data.email);
    if(user.length === 0) throw new Error('User not found');
    if(user[0].password !== data.password) throw new Error('Password is incorrect');

    const {password, ...userWithoutPassword} = user[0];
    return userWithoutPassword;
}
const checkEmailExists = async(email) =>{
    const user = await findUserByEmail(email);
    return user.length > 0;
}
module.exports = {
    allUsers,
    oneUser,
    removeUser,
    insertUser,
    updateUser,
    addUser,
    loginUser,
    checkEmailExists,
};

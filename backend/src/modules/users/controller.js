const table = 'users';

module.exports = function (db) {
    return {
        allUsers: () => db.allUsers(table),
        oneUser: (id) => db.oneUser(table, id),
        removeUser: (body) => db.removeUser(table, body.id),
        addUser: (body) => db.addUser(table, body),
        loginUser: (body) => db.loginUser(body),
        checkEmailExists: (email) => db.checkEmailExists(email),
    };
};

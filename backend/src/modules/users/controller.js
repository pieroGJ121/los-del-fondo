const table = 'users';

module.exports = function (dbInjection) {
    let db = dbInjection || require('../../DB/mysql');

    function allUsers(){
        return db.allUsers(table);
    }
    function oneUser(id){
        return db.oneUser(table,id);
    }
    function removeUser(body){
        return db.removeUser(table,body);
    }
    function addUser(body){
        return db.addUser(table,body);
    }

    return {
        allUsers,
        oneUser,
        removeUser,
        addUser,
    }
}
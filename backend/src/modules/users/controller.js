const table = 'users';
const { Project } = require('../../DB/mongodb');

module.exports = function (db) {
    return {
        allUsers: () => db.allUsers(table),
        oneUser: (id) => db.oneUser(table, id),
        removeUser: (body) => db.removeUser(table, body.id),
        addUser: async (body) => {
            try{
                const newUser = await db.addUser(table, body);
                console.log(newUser);
                const mainProject = new Project({
                    userId: newUser.user.id,
                    name: 'Main Project',
                    status: "default",    
                });
                await mainProject.save();
                return newUser;
            }catch(err){
                console.log('Error Creating user or project:',error);
            }
        },
        loginUser: (body) => db.loginUser(body),
        checkEmailExists: (email) => db.checkEmailExists(email),
    };
};

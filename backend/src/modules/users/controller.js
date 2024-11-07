const table = 'users';
const { Project } = require('../../DB/mongodb');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secretkey';

module.exports = function (db) {
    return {
        allUsers: () => db.allUsers(table),
        oneUser: (id) => db.oneUser(table, id),
        removeUser: (body) => db.removeUser(table, body.id),
        addUser: async (body) => {
            const saltRounds = 10;
            if (body.password) { 
                const hashedPassword = await bcrypt.hash(body.password, saltRounds);
                console.log('hashed password:',hashedPassword);
                body.password = hashedPassword;
            }
            body.id = uuidv4();
            try{
                const newUserResponse = await db.addUser(table, body);
                const newUser = newUserResponse.user;
                if(!newUser) throw new Error('Error creating user');
                const mainProject = new Project({
                    userId: newUser.id,
                    name: 'Main Project',
                    status: "default",    
                });
                await mainProject.save();
                return {user:newUser};
            }catch(err){
                console.log('Error Creating user or project:',err);
                throw err;
            }
        },
        loginUser: async (body) => {
            const user = await db.findUserByEmail(body.email);
            if (!user) throw new Error ( 'User not found');
            const match = await bcrypt.compare(body.password.trim(), user.password);
            if (!match) throw new Error('Invalid password');

            const token = jwt.sign({ id: user.id , username:user.username}, SECRET_KEY, { expiresIn: '1h' });
            const {password, ...userWithoutPassword} = user;
            return {token, user:userWithoutPassword};
        },
        findUserByEmail: (email) => db.findUserByEmail(email),
    };
};
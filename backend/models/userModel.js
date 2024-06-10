const db = require('../services/database').config;
const bcrypt = require('bcrypt')

// Gets all the users
let getUsers = () => new Promise((resolve, reject) =>{
    // sql query string, selects all records from users table
    let usersQuery= "SELECT * FROM users";

        db.query(usersQuery, function(err, users, fields){
            if(err) {
                reject(err)
            } else {
                console.log(users);
                resolve(users);
            }
        })
});

// Gets a single user with a specific id 
let getUser = (id) => new Promise((resolve, reject) => {
    let userQuery = "SELECT * FROM users WHERE id=" + parseInt(id);
    db.query(userQuery, function(err, user, fields) {
        if(err) {
            reject(err);
        } else {
            resolve(user[0]);
        }
    });
});

let updateUser = (userData) => new Promise( async(resolve,reject) =>{
    // The password in userData is hashed; await to ensure the function waits, before proceeding
    userData.password = await bcrypt.hash(userData.password, 10);

    let sql= "UPDATE users SET " + // added space after SET
    //db.escape protecting against sql injection attacks
        "name = " + db.escape(userData.name) +
        ", email = "+ db.escape(userData.email) +
        ", surname = "+ db.escape(userData.surname) +
        ", hero = "+ db.escape(userData.hero) +
        ", info = "+ db.escape(userData.info) +
        ", password = "+ db.escape(userData.password) +
        // Only the user info with this id gets updated
        " WHERE id = "+ db.escape(userData.id); // added space before WHERE
    
    db.query(sql, function(err, result, fields){
        if(err){
            reject(err);
        }
        resolve(userData); /* change for semester project */ 
    })
})


let addUser = (userData) => new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    // Inserts into users table
    let sql = "INSERT INTO users (name, surname, hero, email, info, password) VALUES (" +
        db.escape(userData.name) + "," +
        db.escape(userData.surname) + "," +
        db.escape(userData.hero) + "," +
        db.escape(userData.email) + "," +
        db.escape(userData.info) + "," +
        db.escape(userData.password) + ")";

    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        console.log(result)
        resolve(userData);
    })
});

let deleteUser = (id) => new Promise((resolve, reject) => {
    let sql = "DELETE FROM users WHERE id=" + db.escape(id);

    db.query(sql, function(err, result, fields) {
        if(err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});

module.exports = {
    getUser,
    updateUser,
    addUser,
    deleteUser,
    getUsers,
}

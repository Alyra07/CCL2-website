const userModel = require("../models/userModel");

function getUsers(req, res, next) {
    userModel.getUsers()
        .then(users => res.render("users", {users}))
        .catch((err) => {
            res.status(404)
            next(err);
        })
}

function getUser(req, res, next) {
    userModel.getUser(req.params.id)
        .then(user => res.render('user', { user })) // send user data to 'user' view
        .catch(err => {
            res.status(400);
            next(err);
        });
}

function updateUser(req, res, next) {
    userModel.updateUser(req.body)
        .then(user => res.render('user', { user })) // send updated user data to 'user' view
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
}

function editUser(req, res, next){
    userModel.getUser(req.params.id)
        .then( user => res.render('editUser', {user}))
        .catch(err => res.sendStatus(500))
}

function addUser(req, res, next) {
    // Takes the data from the addUser.ejs form and calls the function from the userModel
    userModel.addUser(req.body)
        .then(() => {
            res.redirect('/')
        })
        .catch(err => res.sendStatus(500));
}

function addUserView(req, res){
    res.render('addUser');
}

function deleteUser(req, res, next) {
    userModel.deleteUser(req.params.id)
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    editUser,
    addUser,
    addUserView,
    deleteUser
}

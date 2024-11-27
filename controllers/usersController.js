const {selectUsers} = require("../models/usersModel")

const fetchUsers = (req, res, next) => {
    selectUsers().then((users)=> {
        res.status(200).send( {users} )
    })
    .catch(next)
}

module.exports = {fetchUsers}
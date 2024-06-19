
const pool = require('../../db');
const queries = require('./queries').default;

const getUsers = (req, res) => {
    // console.log(req);
    pool.query(queries.getUsers, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUserById, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const addUser = (req, res) => {
    const { name, email, password_hash, phone, role } = req.body;
    //check if the email exist
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (results.rows.length) {
            res.send("Email already exists.");
        }
        pool.query(queries.addUser, [name, email, password_hash, phone, role], (error, results) => {
            if (error) throw error;
            res.status(201).send("User created successfully!");
        })
    })
}

const removeUser = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getUserById, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("User does not exist in the database");
        }

        pool.query(queries.removeUser, [id], (error, results) => {
            if (error) throw error;
            res.status(200).send("User removed successfully");
        })
    })
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    pool.query(queries.getUserById, [id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound) {
            res.send("User does not exist");
        }
        pool.query(queries.updateUser, [name, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("User updated successfully");
        });
    });
};

module.exports = {
    getUsers,
    getUserById,
    addUser,
    removeUser,
    updateUser,
};
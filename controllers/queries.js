const getUsers = "SELECT * FROM students";
const getUserById = "SELECT *FROM students WHERE id =$1";

const checkEmailExists = "SELECT s FROM students s WHERE s.email= $1";
const addUser = "INSERT INTO students (name,email,password_hash,phone,role) VALUES ($1,$2,$3,$4,$5)";

const removeUser= "DELETE FROM students WHERE id = $1";
const updateUser = "UPDATE students SET name = $1 WHERE id =$2"



module.exports = {
    getUsers,
    getUserById,
    checkEmailExists,
    addUser,
    removeUser,
    updateUser,
};
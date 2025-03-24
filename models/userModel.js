const db = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUserQuery = async (name, email, phone, username, pass) => {
    // Hash the password
    const hashedPass = await bcrypt.hash(pass, 10);

    const query = `INSERT INTO users (name, email, phone, username, pass) VALUES ($1, $2, $3, $4, $5) returning *`;
    const params = [name, email, phone, username, hashedPass];
    const result = await db.query(query, params);
    return result;
};

const loginUserQuery = async (username) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    const params = [username];
    const result = await db.query(query, params);
    return result;
};

const getAllUsersQuery = async () => {
    const query = `SELECT * FROM users`;
    const result = await db.query(query);
    return result;
};

const getProfileQuery = async (user_id) => {
    const query = `SELECT * FROM users WHERE user_id = $1`;
    const params = [user_id];
    const result = await db.query(query, params);
    return result;
};

const deleteUserQuery = async (user_id) => {
    const query = `DELETE FROM users WHERE user_id = $1 returning *`;
    const params = [user_id];
    const result = await db.query(query, params);
    return result;
};

module.exports = {
    registerUserQuery,
    loginUserQuery,
    getAllUsersQuery,
    getProfileQuery,
    deleteUserQuery,
}
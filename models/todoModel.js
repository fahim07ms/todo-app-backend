const db = require("../config/db");

const getTodosQuery = async (user_id) => {
    const sql = `SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC`;
    const params = [user_id];
    const result = await db.query(sql, params);
    return result;
};

const addTodoQuery = async (user_id, title, description, priority, deadline) => {
    const sql = `INSERT INTO todos (user_id, title, description, priority, deadline) VALUES ($1, $2, $3, $4, $5) returning *`;
    const params = [user_id, title, description, priority, deadline];
    const result = await db.query(sql, params);
    return result;
    
};

const updateTodoQuery = async (user_id, id, title, description, priority, deadline, is_completed) => {
    const sql = `UPDATE todos SET title = $1, description = $2, priority = $3, deadline = $4, is_completed = $5 WHERE  id = $6 AND user_id = $7 returning *`;
    const params = [title, description, priority, deadline, is_completed, id, user_id];
    const result = await db.query(sql, params);
    return result;
};

const getSingleTodoQuery = async (user_id, id) => {
    const sql = `SELECT * FROM todos WHERE  id = $1 AND user_id = $2`;
    const params = [id, user_id];
    const result = await db.query(sql, params);
    return result;
};

const deleteTodoQuery = async (user_id, id) => {
    const sql = `DELETE FROM todos WHERE id = $1 AND user_id = $2 returning *`;
    const params = [id, user_id];
    const result = await db.query(sql, params);
    return result;
};



module.exports = {
    getTodosQuery,
    addTodoQuery,
    updateTodoQuery,
    getSingleTodoQuery,
    deleteTodoQuery,
}
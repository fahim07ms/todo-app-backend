// Controller
const { getSingleTodoQuery, addTodoQuery, updateTodoQuery, getTodosQuery, deleteTodoQuery } = require("../models/todoModel");

// Controller for getting all todos of a user
const getTodos = async (req, res) => {
    try {
        const todos = await getTodosQuery(req.user.user_id);
        if (todos.rows.length === 0) {
            res.status(204).json(todos.rows[0]);
            return;
        }

        res.status(200).json(todos.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Controller that adds a todo
const addTodo = async (req, res) => {
    const { title, description, priority, deadline } = req.body;
    
    // If no title then show error
    if (!title) {
        res.status(400).json({
            error: "Title is required!"
        });
        return;
    } 
    
    // Try to add a task
    try {
        const todos = await addTodoQuery(req.user.user_id, title, description, priority, deadline);
        res.status(201).json({
            message: "Successfully added task!"
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
};  

// Controller for updating a todo
const updateTodo = async (req, res) => {
    const { title, description, priority, deadline, is_completed } = req.body;
    
    try {
        const todos = await updateTodoQuery(req.user.user_id, req.params.id, title, description, priority, deadline, is_completed);
        if (todos.rows.length === 0) {
            res.status(204).json(todos.rows[0]);
            return;
        }

        res.status(200).json(todos.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
};  

// Controller for getting data of a single todo
const getSingleTodo = async (req, res) => {
    
    try {
        const todos = await getSingleTodoQuery(req.user.user_id, req.params.id);
        if (todos.rows.length === 0) {
            res.status(204).json(todos.rows[0]);
            return;
        }

        res.status(200).json(todos.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
};

// Controller for deleting a todo
const deleteTodo = async (req, res) => {
    try {
        const todos = await deleteTodoQuery(req.user.user_id, req.params.id);

        if (todos.rows.length === 0) {
            res.status(204).json(todos.rows[0]);
            return;
        } else {
            res.status(200).json(todos.rows[0]);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal Server Error"
        });
        return;
    }
};

module.exports = {
    getTodos,
    addTodo, 
    updateTodo, 
    getSingleTodo,
    deleteTodo,
}
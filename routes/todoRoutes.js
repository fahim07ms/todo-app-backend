const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { profileRoute, verifyToken } = require("./authRoutes");


// Import necessary controllers


// Get request for `/api/todos` route
router.get("/", verifyToken, async (req, res) => {
    const sql = `SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC`;
    const params = [req.user.user_id];
    
    try {
        const todos = await db.query(sql, params);
        if (todos.rows.length === 0) {
            res.status(204).json(todos.rows[0]);
            return;
        }

        res.status(200).json(todos.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
});

// POST request for `/api/todos/:id` route
router.post("/", verifyToken, async (req, res) => {
    const { title, description, priority, deadline } = req.body;

    // If no title then show error
    if (!title) {
        res.status(400).json({
            error: "Title is required!"
        });
        return;
    } 

    const sql = `INSERT INTO todos (user_id, title, description, priority, deadline) VALUES ($1, $2, $3, $4, $5)`;
    const params = [req.user.user_id, title, description, priority, deadline];
    
    try {
        const todos = await db.query(sql, params);

        res.status(201).json({
            message: "Successfully added task!"
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
    }
});

// Get request for `/api/todos/:id` route
router.put("/:id", verifyToken, async (req, res) => {

    const { title, description, priority, deadline, is_completed } = req.body;

    const sql = `UPDATE todos SET title = $1, description = $2, priority = $3, deadline = $4, is_completed = $5 WHERE  id = $6 AND user_id = $7 returning *`;
    const params = [title, description, priority, deadline, is_completed, req.params.id, req.user.user_id];

    try {
        const todos = await db.query(sql, params);
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
});

// Get request for `/api/todos/:id` route
router.get("/:id", verifyToken, async (req, res) => {
    const sql = `SELECT * FROM todos WHERE  id = $1 AND user_id = $2`;
    const params = [req.params.id, req.user.user_id];
    
    try {
        const todos = await db.query(sql, params);
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
});


// Delete request for `/api/todos/:id` route
router.delete("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM todos WHERE id = $1 AND user_id = $2 returning *`;

    try {
        const params = [id, req.user.user_id];
        const todos = await db.query(sql, params);

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
});

module.exports = router;
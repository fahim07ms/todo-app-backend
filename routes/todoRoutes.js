const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");

// Import necessary controllers
const { getTodos, addTodo, updateTodo, getSingleTodo, deleteTodo } = require("../controllers/todoController");

// Get request for `/api/todos` route
router.get("/", verifyToken, getTodos);

// POST request for `/api/todos` route
router.post("/", verifyToken, addTodo);

// Get request for `/api/todos/:id` route
router.put("/:id", verifyToken, updateTodo);

// Get request for `/api/todos/:id` route
router.get("/:id", verifyToken, getSingleTodo);

// Delete request for `/api/todos/:id` route
router.delete("/:id", verifyToken, deleteTodo);

module.exports = {
    todosRoute: router,
};
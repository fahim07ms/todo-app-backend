const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated todo ID
 *         title:
 *           type: string
 *           description: Title of the todo
 *         description:
 *           type: string
 *           description: Detailed description of the todo
 *         priority:
 *           type: integer
 *           description: Priority number for a todo
 *         is_completed:
 *           type: boolean
 *           description: Status of the todo
 *           default: false
 *         user_id:
 *           type: uuid
 *           description: ID of the user who created the todo
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp of todo creation
 *         deadline:
 *            type: string
 *            format: date-time
 *            description: Deadline time for the todo
 */

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management endpoints
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for the authenticated user
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Server error
 *   
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *     responses:
 *       201:
 *         description: Successfully added task!
 *       400:
 *         description: Title is required!
 *       500:
 *         description: Internal server error!
 */

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo by ID
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal server error!
 *   
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: integer
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *        description: Todo details
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       500:
 *         description: Internal Server Error
 *   
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       500:
 *         description: Internal Server Error
 */


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
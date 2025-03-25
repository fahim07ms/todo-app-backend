// Create an Express app instance
const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

// Swagger 
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require("./swaggerConfig");

const { profileRoute } = require("./routes/authRoutes");
const { todosRoute } = require("./routes/todoRoutes");

// Dotenv for environment file
const dotenv = require("dotenv");
dotenv.config();

// Port for the application
const port = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users/", profileRoute);
app.use("/api/todos/", todosRoute);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route endpoint
app.get('/', (req, res) => {
    res.json({ messgage: "Server is running!!!" });
});

// Testing the app when server starts
app.listen(port, () => {
    console.log(`Todo app started listening on port ${port}`);
});

module.exports = app
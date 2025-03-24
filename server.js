// Create an Express app instance
const express = require("express");
const app = express();
const { profileRoute } = require("./routes/authRoutes");
const { todosRoute } = require("./routes/todoRoutes");

// Dotenv for environment file
const dotenv = require("dotenv");
dotenv.config();

// Port for the application
const port = process.env.PORT || 3002;

// Middleware for parsing incoming JSON data
app.use(express.json());

// Route for users
app.use("/api/users/", profileRoute);
app.use("/api/todos/", todosRoute);

// Root route endpoint
app.get('/', (req, res) => {
    res.json({ messgage: "Server is running!!!" });
});

// Testing the app when server starts
app.listen(port, () => {
    console.log(`Todo app started listening on port ${port}`);
});

module.exports = app
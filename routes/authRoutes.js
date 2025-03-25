const express = require("express");
const router = express.Router();

// Import Controllers
const { verifyToken, registerUser, loginUser, logoutUser, getAllUsers, getProfile, deleteUser } = require("../controllers/authController");

// Signup Route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Logout a user
router.post("/logout", verifyToken, logoutUser);

// Get all users
router.get("/", verifyToken, getAllUsers);

// Get the profile data of a user
router.get("/profile", verifyToken, getProfile);

// Delete a user
router.delete("/delete", verifyToken, deleteUser);


module.exports = {
    profileRoute: router, 
};

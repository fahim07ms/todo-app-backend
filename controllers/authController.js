const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("redis");
const dotenv = require("dotenv");
const { registerUserQuery, loginUserQuery, getAllUsersQuery, getProfileQuery, deleteUserQuery } = require("../models/userModel");


dotenv.config();

const redisClient = redis.createClient({
    socket: {
        url: process.env.REDIS_URL,
        tls: {} // Enables secure connection
    },
    password: process.env.REDIS_PASSWORD
});


// Middleware for token verification
const verifyToken = async (req, res, next) => {
    // Get token
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(403).json({
            error: "Access denied. Token missing!"
        });
        return;
    }

    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
        res.status(403).json({ error: "Token is blacklisted. Please log in again." });
        return;
    }

    // Try to decode the token and get the user data
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
};  

// Middleware for accessing new access token
const refreshToken = async (req, res) => {
    // Get refreshToken from the cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(403).json({ error: "Refresh token missing!" });
        return;
    }

    try {
        // Verify refresh token 
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

        const newAccessToken = jwt.sign(
            { user_id: user.user_id, username: username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(403).json({ error: "Invalid or expired refresh token!" });
        return;
    }   
};

// User registration Controller
const registerUser = async (req, res) => {
    const { name, email, phone, username, pass, cpass } = req.body;

    // Check if user confirms the password correctly
    if (pass !== cpass) {
        res.status(401).json({ message: "Passwords don't match" });
        return;
    }

    try {
        const user = await registerUserQuery(name, email, phone, username, pass);
        if (user.rows.length === 0) {
            res.status(400).json({ error: "Can't register" });
            return;
        }  

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while registering user!" });
        return;
    }
};

// User Login Route
const loginUser = async (req, res) => {
    const { username, pass } = req.body;

    try {
        // Find the user
        const result = await loginUserQuery(username);
        if (result.rows.length === 0) {
            res.status(401).json({ error: "User not found!" });
            return;
        }

        const user = result.rows[0];

        // Compare provided password with the stored hashed password
        const passMatch = bcrypt.compare(pass, user.pass);
        if (!passMatch) {
            res.status(403).json({ error: "Invalid credentials!" });
            return;
        }



        // Create the JWT Access Token
        const accessToken = jwt.sign(
            { user_id: user.user_id, username: username, role: user.role }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );

        // Create the JWT Refresh Token
        const refreshToken = jwt.sign(
            { user_id: user.user_id, username: username, role: user.role }, // Payload
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Store refresh token in an HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,    
            secure: true,      
            sameSite: "Strict", 
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });

        // Send the token
        res.status(201).json({ accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while loggin in!" });
        return;
    }
};

// Controller for logging out user
const logoutUser = async (req, res) => {
    // Extract tokens
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    try {
        if (accessToken) {
            await redisClient.set(accessToken, "blacklisted", { EX: 900 })
        } 

        res.clearCokie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });

        res.status(200).json({ message: "Successfully logged out." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during logout." });
    }
};


// Controller for accessing all users
const getAllUsers = async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ error: "Forbidden! You are not an administrator." });
        return;
    }

    try {
        const users = await getAllUsersQuery();
    
        if (users.rows.length === 0) {
            res.status(404).send(users.rows[0]);
            return;
        }

        res.status(200).send(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!",
        });
        return;
    }
};

// Controller for getting the profile
const getProfile = async (req, res) => {
    const user_id = req.user.user_id;

    // Find the user
    try {
        const result = await getProfileQuery(user_id);
        if (result.rows.length === 0) {
            res.status(401).json({
                error: "User not found!",
            });
            return;
        }

        const { pass, ...userWithoutPass } = result.rows[0];
        res.status(200).json(userWithoutPass);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!",
        });
        return;
    }
};

// Controller for deleting a user 
const deleteUser = async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await deleteUserQuery(user_id);
        if (result.rows.length === 0) {
            res.send(404).json({ error: "No such user" });
            return;
        } 
        res.status(200).json({
            message: "User deleted successfully!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error!"
        });
        return;
    }
};



// Exports
module.exports = {
    verifyToken,
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getProfile,
    deleteUser,
    refreshToken
}
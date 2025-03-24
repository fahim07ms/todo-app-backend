const jwt = require("jsonwebtoken");
const { registerUserQuery, loginUserQuery, getAllUsersQuery, getProfileQuery, deleteUserQuery } = require("../models/userModel");

// Middleware for token verification
const verifyToken = (req, res, next) => {
    // Get token
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(403).json({
            error: "Access denied. Token missing!"
        });
        return;
    }

    // Try to decode the token and get the user data
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Invalid or expired token"
        });
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
        const user = registerUserQuery(name, email, phone, username, pass);
        if (user.rows.length !== 1) {
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
        const result = loginUserQuery(username);
        if (result.rows.length === 0) {
            res.status(401).json({
                error: "User not found!",
            });
            return;
        }

        const user = result.rows[0];

        // Compare provided password with the stored hashed password
        const passMatch = bcrypt.compare(pass, user.pass);
        if (!passMatch) {
        res.status(403).json({
            error: "Invalid credentials!",
        });
        return;
        }

        // Create the JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, username: username, role: user.role }, // Payload
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send the token
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while loggin in!" });
        return;
    }
};

// Controller for accessing all users
const getAllUsers = async (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403).json({ error: "Forbidden! You are not an administrator." });
        return;
    }

    try {
        const users = getAllUsers();
    
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
        const result = getProfileQuery(user_id);
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
        const result = deleteUserQuery(user_id);
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
    getAllUsers,
    getProfile,
    deleteUser,
}
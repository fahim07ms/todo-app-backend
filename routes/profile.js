const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function for token verification
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

// Signup Route
router.post("/register", async (req, res) => {
  const { name, email, phone, username, pass, cpass } = req.body;

  // Check if user confirms the password correctly
  if (pass !== cpass) {
    res.status(401).json({
      message: "Passwords don't match",
    });
    return;
  }

  // Hash the password
  const hashedPass = await bcrypt.hash(pass, 10);

  try {
    const query = `INSERT INTO users (name, email, phone, username, pass) VALUES ($1, $2, $3, $4, $5)`;
    const params = [name, email, phone, username, hashedPass];
    await db.query(query, params);
    res.status(201).json({
      message: "User registered successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error while registering user!",
    });
    return;
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, pass } = req.body;

  try {
    // Find the user
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
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
      { user_id: user.user_id, username: username }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    // Send the token
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error while loggin in!",
    });
    return;
  }
});

// Get all users
router.get("/", async (req, res) => {
    try {
      const sql = `SELECT * FROM users`;
      const users = await db.query(sql);
  
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
});

// Get the profile data of a user
router.get("/profile", verifyToken, async (req, res) => {
  const user_id = req.user.user_id;

  // Find the user
  try {
    const result = await db.query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
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
});

// Delete a user
router.delete("/delete", verifyToken, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const sql = "DELETE FROM users WHERE user_id = $1";
        await db.query(sql, [user_id]);

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
});


module.exports = {
    profileRoute: router, 
    verifyToken: verifyToken
};

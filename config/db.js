// Importing pool class
const { Pool } = require("pg");

// Dotenv loads .env file into process.env
const dotenv = require("dotenv");
dotenv.config();

// 
const pool = new Pool({
    user: process.env.DB_USER,          // Database username
    database: process.env.DB_NAME,      // Database name
    host: process.env.DB_HOST,          // Database host
    port: process.env.DB_PORT,          // Database port
    password: process.env.DB_PASSWORD,  // Database password
    max: 20,                            // Max number of client connections in the pool
    idleTimeoutMillis: 30000,           // (30 seconds) Disconnect idle clients after this time
    connectionTimeoutMillis: 2000       // (2 seconds) Timeout if connection isn't established
});

// When a new user connects to the database pool
pool.on("connect", () => {
    console.log("DB connected!");
});

// When an error occurs while connecting to the database pool
pool.on("error", () => {
    console.log("Could not connect to database");
});

module.exports = pool;
const swaggerJsdoc = require('swagger-jsdoc');


// Swagger definition
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo App API",
            version: "1.0.0",
            description: "API documentation for the Todo App",
        },
        servers: [
            {
                url: "http://localhost:3002",  
                description: "Local server",
            },
            {
                url: "https://todo-app-backend-lemon-iota.vercel.app", 
                description: "Production server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerSpec
};
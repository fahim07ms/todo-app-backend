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
                url: "https://todo-app-backend-lemon-iota.vercel.app/", // Change if needed
                description: "Production server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerSpec
};
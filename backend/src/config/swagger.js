const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course Management API",
      version: "1.0.0",
      description: "API documentation for Course Management System",
    },
    servers: [
      {
        url: "http://localhost:5001/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/*.js"),
  ],
};



const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
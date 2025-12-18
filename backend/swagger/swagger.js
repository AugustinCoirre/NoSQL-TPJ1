const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mongoflix API",
      version: "1.0.0",
      description:
        "API REST pour la gestion de films, réalisateurs et critiques",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Directors",
        description: "Gestion des réalisateurs",
      },
      {
        name: "Movies",
        description: "Gestion des films",
      },
      {
        name: "Reviews",
        description: "Gestion des critiques",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
};

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const openapiSpec = YAML.load("./specification.yaml");

const swaggerDocsRouter = express.Router();

swaggerDocsRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec))
    .get("/specification.json", (req, res) => {
        res.send(openapiSpec);
    });

module.exports = swaggerDocsRouter;
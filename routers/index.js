const express = require("express");
// const router = require("./users");
const routers = express.Router();

// user routes
routers.use("/", require("./user"));

// student routes
routers.use("/student", require("./student"));

// interview routes
routers.use("/interview", require("./interview"));

module.exports = routers;
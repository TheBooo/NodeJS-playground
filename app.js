const express = require("express");
const app = express();
const winston = require("winston");

//errors and info logging
require("./startup/logging")();
//routes
require("./startup/routes")(app);
//DB
require("./startup/mongoose")();
//check jwt private key and config
require("./startup/config")();

//listen port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info("listening port 3000..."));

module.exports = server;

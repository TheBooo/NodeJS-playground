const winston = require("winston");

module.exports = function () {
  process.on("unhandledRejection", (error) => {
    throw error;
  });
  winston.handleExceptions(
    //new winston.transports.console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  winston.add(winston.transports.File, { filename: "logfile.log" });
};

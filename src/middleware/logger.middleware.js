
import winston from "winston";

const logger = winston.createLogger({
  // Write your code here
  level:"info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({filename: "logs.txt"})
  ]  
});

const loggerWinston = (req, res, next) => {

    const logMsg = `req URL: ${req.originalUrl} req body: ${JSON.stringify(req.body)}`;
    logger.info(logMsg);
    next()

}

export default loggerWinston;
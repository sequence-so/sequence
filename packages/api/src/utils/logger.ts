import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.timestamp(),
  transports: [new winston.transports.Console()],
});

export default logger;

import * as winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.cli(),
  defaultMeta: { service: "api" },
  transports: [new winston.transports.Console()],
});

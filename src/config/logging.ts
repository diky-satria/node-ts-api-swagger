import { createLogger, format, transports } from "winston";
const { printf, combine, ms } = format;
import DailyRotateFile from "winston-daily-rotate-file";
import HDate from "../helpers/HDate";

// LOGGER REQUESTS
const tError: DailyRotateFile = new DailyRotateFile({
  level: "error",
  filename: `./src/storage/logs/node-%DATE%.log`,
  zippedArchive: true,
  maxFiles: "14d",
  handleExceptions: true,
  handleRejections: true,
});

const tInfo: DailyRotateFile = new DailyRotateFile({
  level: "info",
  filename: `./src/storage/logs/payloads/${HDate.frFolderDate()}/ReqNRes-%DATE%.log`,
  zippedArchive: true,
  maxFiles: "14d",
  format: format((info) => {
    return info.level === "info" ? info : false;
  })(),
});

const logFormat = printf(({ level, label, message, ms }) => {
  return `[${HDate.frFullDate()}] ${level.toUpperCase()}: ${label} => ${message} (${ms})`;
});

const logger = createLogger({
  format: combine(ms(), logFormat),
  transports: [new transports.Console(), tError, tInfo],
});

// LOGGER QUERY
const tInfoQuery: DailyRotateFile = new DailyRotateFile({
  level: "info",
  filename: `./src/storage/logs/queries/${HDate.frFolderDate()}/queries-%DATE%.log`,
  zippedArchive: true,
  maxFiles: "14d",
  format: format((info) => {
    return info.level === "info" ? info : false;
  })(),
});

const logFormatQuery = printf(({ level, label, message, ms }) => {
  return `[${HDate.frFullDate()}] ${message} (${ms})`;
});

const loggerQuery = createLogger({
  format: combine(ms(), logFormatQuery),
  transports: [new transports.Console(), tInfoQuery],
});

export { logger, loggerQuery };

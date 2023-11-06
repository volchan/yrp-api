import winston from 'winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  psql: 5,
  http: 4,
  debug: 5,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  psql: 'green',
  debug: 'blue',
}

const timeFormat = 'YYYY-MM-DD HH:mm:ss Z'

winston.addColors(colors)

const devFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: timeFormat }),
  winston.format.colorize(),
  winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
)

const prodFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: timeFormat }),
  winston.format.json(),
)

const transports = [new winston.transports.Console()] as winston.transport[]

const logger = winston.createLogger({
  levels,
  transports,
  level: 'debug',
  exitOnError: false,
  format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exception.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
})

export default logger

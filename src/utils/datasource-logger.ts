import { Logger } from 'typeorm'
import logger from './logger'

export default class DataSourceLogger implements Logger {
  logQuery(query: string, parameters?: unknown[]) {
    logger.log('psql', `Query: ${query}`)
    if (parameters && parameters.length > 0) logger.log('psql', `Parameters: ${parameters}`)
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    logger.log('psql', `Error: ${error}`)
    logger.log('psql', `Query: ${query}`)
    if (parameters && parameters.length > 0) logger.log('psql', `Parameters: ${parameters}`)
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    logger.log('psql', `Time: ${time}`)
    logger.log('psql', `Query: ${query}`)
    if (parameters && parameters.length > 0) logger.log('psql', `Parameters: ${parameters}`)
  }

  logSchemaBuild(message: string) {
    logger.log('psql', `Message: ${message}`)
  }

  logMigration(message: string) {
    logger.log('psql', `Message: ${message}`)
  }

  log(level: 'log' | 'info' | 'warn', message: unknown) {
    logger.log('psql', `Level: ${level}`)
    logger.log('psql', `Message: ${message}`)
  }
}

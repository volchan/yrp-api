import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import send from './response-handler.middleware'
import { logger } from '@utils/logger'

export default function errorHandlerMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(err.stack)

  return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: err.message })
}

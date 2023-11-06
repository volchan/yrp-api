import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import send from './response-handler.middleware'

export default function errorHandlerMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(err) // eslint-disable-line no-console

  return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: err.message })
}

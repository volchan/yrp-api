import { NextFunction, Request, Response } from 'express'

export default function errorHandlerMiddleware(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(err) // eslint-disable-line no-console

  return res.status(500).json({
    status: 'Error',
    error: 'Internal Server Error',
  })
}

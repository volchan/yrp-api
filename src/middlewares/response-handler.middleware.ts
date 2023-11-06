import { Request, Response } from 'express'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

type ResponseData = {
  [key: string]: unknown
}

export default function send(req: Request, res: Response, statusCode: StatusCodes, data: ResponseData) {
  return res.status(statusCode).json({
    status: getReasonPhrase(statusCode),
    data,
  })
}

import send from '@middlewares/response-handler.middleware'
import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

const AppRouter = express.Router()

AppRouter.get('/', (req: Request, res: Response) => {
  return res.redirect('/health')
})

AppRouter.get('/health', (req: Request, res: Response) => {
  return send(req, res, StatusCodes.OK, { message: 'Server is healthy' })
})

AppRouter.options('*')
AppRouter.use('*', (req: Request, res: Response) => {
  return send(req, res, StatusCodes.NOT_FOUND, { message: 'The page you are looking for does not exist' })
})

export default AppRouter

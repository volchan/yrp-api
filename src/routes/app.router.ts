import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import send from '@middlewares/response-handler.middleware'

import AuthRouter from './auth.router'
import UsersRouter from './users.router'

const AppRouter = express.Router()

AppRouter.get('/', (req: Request, res: Response) => {
  return res.redirect('/health')
})

AppRouter.get('/health', (req: Request, res: Response) => {
  return send(req, res, StatusCodes.OK, { message: 'Server is healthy' })
})

AppRouter.use('/auth', AuthRouter)
AppRouter.use('/users', UsersRouter)

AppRouter.options('*')
AppRouter.use('*', (req: Request, res: Response) => {
  return send(req, res, StatusCodes.NOT_FOUND, { message: 'The page you are looking for does not exist' })
})

export default AppRouter

import express, { Request, Response } from 'express'

const AppRouter = express.Router()

AppRouter.get('/', (req: Request, res: Response) => {
  return res.redirect('/health')
})

AppRouter.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
  })
})

AppRouter.use('*', (req: Request, res: Response) => {
  return res.status(404).json({
    status: 'Not Found',
    message: 'The route you are trying to access does not exist',
  })
})

export default AppRouter

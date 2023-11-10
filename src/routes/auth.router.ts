import { AuthController } from '@controllers/auth.controller'
import { Router } from 'express'

const AuthRouter = Router()

AuthRouter.get('/sign_in', AuthController.sign_in)

export default AuthRouter

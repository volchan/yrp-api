import { AuthController } from '@controllers/auth.controller'
import { authentification } from '@middlewares/auth.middleware'
import { Router } from 'express'

const AuthRouter = Router()

AuthRouter.post('/sign_in', AuthController.signIn)
AuthRouter.post('/sign_up', AuthController.signUp)
AuthRouter.delete('/sign_out', authentification, AuthController.signOut)
AuthRouter.put('/refresh_token', AuthController.refreshAccessToken)
AuthRouter.patch('/refresh_token', AuthController.refreshAccessToken)

export default AuthRouter

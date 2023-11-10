import { Router } from 'express'

import { UserController } from '@controllers/user.controller'
import { authentification } from '@middlewares/auth.middleware'
import { authorization } from '@middlewares/authorization.middleware'
import Roles from '@utils/roles'

const UsersRouter = Router()

UsersRouter.get('/me', authentification, authorization([Roles.ADMIN, Roles.USER]), UserController.me)
UsersRouter.put('/:id', authentification, authorization([Roles.ADMIN, Roles.USER]), UserController.update)
UsersRouter.patch('/:id', authentification, authorization([Roles.ADMIN, Roles.USER]), UserController.update)

export default UsersRouter

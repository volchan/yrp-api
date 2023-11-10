import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import Roles from '@utils/roles'
import send from './response-handler.middleware'

export const authorization = (roles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req[' currentUser']
    if (!roles.includes(user!.role)) {
      return send(req, res, StatusCodes.FORBIDDEN, { message: 'Forbidden' })
    }
    next()
  }
}

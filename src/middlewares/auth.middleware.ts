import config from 'config'
import * as jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'

import { User } from '@entities/user.entity'
import { AppDataSource } from 'src/data-source'
import send from './response-handler.middleware'
import { JwtDTO } from '@dtos/jwt.dto'
import { plainToClass } from 'class-transformer'

export const authentification = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header) return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  const token = header.split(' ')[1]
  if (!token) return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  const decode = jwt.verify(token, config.get<string>('jwtSecret'))
  if (!decode) return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({ where: { id: plainToClass(JwtDTO, decode).id } })
  if (!user) return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  req[' currentUser'] = user
  next()
}

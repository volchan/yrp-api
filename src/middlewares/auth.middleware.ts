import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'

import { User } from '@entities/user.entity'
import { AppDataSource } from 'src/data-source'
import send from './response-handler.middleware'
import { JwtDTO } from '@dtos/jwt.dto'
import { plainToClass } from 'class-transformer'
import { JWTEnvKeys, verifyJwt } from '@utils/jwt'
import redisClient from '@utils/redis'

export const authentification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let accessToken

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken
    }

    if (!accessToken) {
      return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'You are not logged in' })
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(accessToken, JWTEnvKeys.ATPUBKEY)
    if (!decoded) {
      return send(req, res, StatusCodes.UNAUTHORIZED, { message: "Invalid token or user doesn't exist" })
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub)
    if (!session) {
      return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Invalid token or session has expired' })
    }

    // Check if the user still exist
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id: plainToClass(JwtDTO, JSON.parse(session)).id } })
    if (!user) {
      return send(req, res, StatusCodes.UNAUTHORIZED, { message: "Session has expired or user doesn't exist" })
    }

    // Add user to res.locals
    res.locals.currentUser = user
    next()
  } catch (error) {
    next(error)
  }
}

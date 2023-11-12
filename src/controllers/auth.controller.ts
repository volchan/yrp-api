import config from 'config'
import { plainToClass } from 'class-transformer'
import { CookieOptions, NextFunction, Request, Response } from 'express'

import logger from '@utils/logger'
import redisClient from '@utils/redis'
import { User } from '@entities/user.entity'
import { AppDataSource } from '../data-source'
import { StatusCodes } from 'http-status-codes'
import send from '@middlewares/response-handler.middleware'
import { CreateUserDTO, LoginUserDTO } from '@dtos/user.dto'
import { JWTEnvKeys, comparePassword, generateTokens, signJwt, verifyJwt } from '@utils/jwt'

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
}

if (config.get<boolean>('isProduction')) cookiesOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.get<number>('accessToken.expiresIn') * 60 * 1000),
  maxAge: config.get<number>('accessToken.expiresIn') * 60 * 1000,
}

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.get<number>('refreshToken.expiresIn') * 60 * 1000),
  maxAge: config.get<number>('refreshToken.expiresIn') * 60 * 1000,
}

export class AuthController {
  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = plainToClass(LoginUserDTO, req.body)
      if (!email || !password) {
        return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: ' email and password required' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { email } })
      if (!user) return send(req, res, StatusCodes.BAD_REQUEST, { message: 'Bad email or password' })

      const isPasswordValid = comparePassword(password, user.password)
      if (!isPasswordValid) return send(req, res, StatusCodes.BAD_REQUEST, { message: 'Bad email or password' })

      const { accessToken, refreshToken } = await generateTokens(user)

      res.cookie('accessToken', accessToken, accessTokenCookieOptions)
      res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      res.cookie('loggedIn', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      })

      return send(req, res, StatusCodes.OK, { accessToken })
    } catch (error) {
      logger.error(error)
      return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
    }
  }

  static async signUp(req: Request, res: Response) {
    try {
      const { email, password } = plainToClass(CreateUserDTO, req.body)
      if (!email || !password) {
        return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: ' email, password and name required' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const existingUser = await userRepository.findOne({ where: { email } })
      if (existingUser) return send(req, res, StatusCodes.BAD_REQUEST, { message: 'Email already exists' })

      const newUser = new User()
      newUser.email = email
      newUser.password = password

      const user = await userRepository.save(newUser)

      const { accessToken, refreshToken } = await generateTokens(user)

      res.cookie('accessToken', accessToken, accessTokenCookieOptions)
      res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      res.cookie('loggedIn', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      })

      return send(req, res, StatusCodes.OK, { accessToken })
    } catch (error) {
      logger.error(error)
      return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
    }
  }

  static async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken

      const message = 'Could not refresh access token'
      if (!refreshToken) {
        return send(req, res, StatusCodes.FORBIDDEN, { message })
      }

      // Validate refresh token
      const decoded = verifyJwt<{ sub: string }>(refreshToken, JWTEnvKeys.RTPUBKEY)
      if (!decoded) {
        return send(req, res, StatusCodes.FORBIDDEN, { message })
      }

      // Check if user has a valid session
      const session = await redisClient.get(decoded.sub)
      if (!session) {
        return send(req, res, StatusCodes.FORBIDDEN, { message })
      }

      // Check if user still exist
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: JSON.parse(session).id } })
      if (!user) {
        return send(req, res, StatusCodes.FORBIDDEN, { message })
      }

      // Sign new access token
      const accessToken = signJwt(user, JWTEnvKeys.ATPRIVKEY, {
        expiresIn: `${config.get<number>('accessToken.expiresIn')}m`,
      })

      // 4. Add Cookies
      res.cookie('accessToken', accessToken, accessTokenCookieOptions)
      res.cookie('loggedIn', true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      })

      // 5. Send response
      send(req, res, StatusCodes.OK, { accessToken })
    } catch (err: any) {
      next(err)
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.currentUser

      await redisClient.del(user.id)
      res.cookie('accessToken', '', { maxAge: 1 })
      res.cookie('refreshToken', '', { maxAge: 1 })
      res.cookie('loggedIn', '', { maxAge: 1 })

      send(req, res, StatusCodes.OK, { message: 'Logout successfully' })
    } catch (err: any) {
      next(err)
    }
  }
}

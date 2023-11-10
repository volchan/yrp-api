import { Request, Response } from 'express'

import { User } from '@entities/user.entity'
import { AppDataSource } from '../data-source'
import { StatusCodes } from 'http-status-codes'
import { comparePassword, generateToken } from '@utils/jwt'
import send from '@middlewares/response-handler.middleware'
import logger from '@utils/logger'
import { plainToClass } from 'class-transformer'
import { CreateUserDTO, LoginUserDTO } from '@dtos/user.dto'

export class AuthController {
  static async sign_in(req: Request, res: Response) {
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

      const token = generateToken(user)

      return send(req, res, StatusCodes.OK, { token })
    } catch (error) {
      logger.error(error)
      return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
    }
  }

  static async sign_up(req: Request, res: Response) {
    try {
      const { email, password } = plainToClass(CreateUserDTO, req.body)
      if (!email || !password) {
        return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: ' email, password and name required' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { email } })
      if (user) return send(req, res, StatusCodes.BAD_REQUEST, { message: 'Email already exists' })

      const newUser = new User()
      newUser.email = email
      newUser.password = password

      await userRepository.save(newUser)

      const token = generateToken(newUser)

      return send(req, res, StatusCodes.OK, { token })
    } catch (error) {
      logger.error(error)
      return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
    }
  }
}

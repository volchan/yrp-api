import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import send from '@middlewares/response-handler.middleware'
import { plainToClass } from 'class-transformer'
import { AdminUpdateUserDTO, UpdateUserDTO, UserDTO } from '@dtos/user.dto'
import { AppDataSource } from 'src/data-source'
import { User } from '@entities/user.entity'
import logger from '@utils/logger'

export class UserController {
  static async me(req: Request, res: Response) {
    const currentUser: User = res.locals.currentUser

    if (!currentUser) {
      return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })
    }

    return send(req, res, StatusCodes.OK, {
      user: plainToClass(UserDTO, currentUser, { excludeExtraneousValues: true }),
    })
  }

  static async update(req: Request, res: Response) {
    try {
      const currentUser: User = res.locals.currentUser
      if (!currentUser) {
        return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })
      }

      logger.info(currentUser.isAdmin())
      const dto = currentUser.isAdmin() ? AdminUpdateUserDTO : UpdateUserDTO
      const updateData = plainToClass(dto, req.body, { excludeExtraneousValues: true })
      logger.info(updateData.role)

      if (!currentUser.isAdmin() && req.params.id !== currentUser.id) {
        return send(req, res, StatusCodes.UNAUTHORIZED, { message: 'Unauthorized' })
      }

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOne({ where: { id: req.params.id } })
      if (!user) return send(req, res, StatusCodes.NOT_FOUND, { message: 'User not found' })

      userRepository.merge(user, updateData)
      const updatedUser = await userRepository.save(user)

      return send(req, res, StatusCodes.OK, {
        user: plainToClass(UserDTO, updatedUser, { excludeExtraneousValues: true }),
      })
    } catch (error) {
      logger.error(error)
      return send(req, res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
    }
  }
}

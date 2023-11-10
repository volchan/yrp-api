import config from 'config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { User } from '@entities/user.entity'
import { instanceToPlain, plainToClass } from 'class-transformer'
import { CreateJwtTokenDTO } from '@dtos/jwt.dto'

export const hashPassword = async (password: string) => {
  return bcrypt.hashSync(password, 12)
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

export const generateToken = (payload: User) => {
  return jwt.sign(
    instanceToPlain(plainToClass(CreateJwtTokenDTO, payload), { excludeExtraneousValues: true }),
    config.get<string>('jwtSecret'),
    {
      expiresIn: '1d',
    },
  )
}

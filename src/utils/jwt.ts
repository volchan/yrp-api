import config from 'config'
import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { User } from '@entities/user.entity'
import { instanceToPlain, plainToClass } from 'class-transformer'
import { CreateJwtTokenDTO } from '@dtos/jwt.dto'
import redisClient from './redis'

export enum JWTEnvKeys {
  ATPRIVKEY = 'accessToken.privateKey',
  ATPUBKEY = 'accessToken.publicKey',
  RTPRIVKEY = 'refreshToken.privateKey',
  RTPUBKEY = 'refreshToken.publicKey',
}

export const hashPassword = async (password: string) => {
  return bcrypt.hashSync(password, 12)
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

export const signJwt = (payload: User, keyName: JWTEnvKeys.ATPRIVKEY | JWTEnvKeys.RTPRIVKEY, options: SignOptions) => {
  const privateKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
  const formattedPayload = instanceToPlain(plainToClass(CreateJwtTokenDTO, payload), { excludeExtraneousValues: true })
  return jwt.sign({ sub: formattedPayload.id }, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}

export const verifyJwt = <T>(token: string, keyName: JWTEnvKeys.ATPUBKEY | JWTEnvKeys.RTPUBKEY): T | null => {
  try {
    const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
    const decoded = jwt.verify(token, publicKey) as T

    return decoded
  } catch (error) {
    return null
  }
}

export const generateTokens = async (user: User) => {
  // 1. Create Session
  redisClient.set(
    user.id,
    JSON.stringify(instanceToPlain(plainToClass(CreateJwtTokenDTO, user, { excludeExtraneousValues: true }))),
    {
      EX: config.get<number>('redis.cacheExpiresIn') * 60,
    },
  )

  // 2. Create Access and Refresh tokens
  const accessToken = signJwt(user, JWTEnvKeys.ATPRIVKEY, {
    expiresIn: `${config.get<number>('accessToken.expiresIn')}m`,
  })

  const refreshToken = signJwt(user, JWTEnvKeys.RTPRIVKEY, {
    expiresIn: `${config.get<number>('refreshToken.expiresIn')}m`,
  })

  return { accessToken, refreshToken }
}

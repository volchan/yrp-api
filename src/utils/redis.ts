import config from 'config'
import { createClient } from 'redis'

import logger from './logger'

const redisUrl = config.get<string>('redis.url')

const redisClient = createClient({
  url: redisUrl,
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
    logger.info('Redis client connect successfully')
    redisClient.set('try', 'Hello Welcome to Express with TypeORM')
  } catch (error) {
    logger.error(error)
    setTimeout(connectRedis, 5000)
  }
}

connectRedis()

export default redisClient

import dotenv from 'dotenv'

dotenv.config()

const { env } = process

export default {
  env: env.NODE_ENV,
  port: env.PORT,

  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',

  allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || [],

  flareSolverBaseUrl: env.FLARE_SOLVER_BASE_URL,
  yggBasePasskey: env.YGG_BASE_PASSKEY,

  jwtSecret: env.JWT_SECRET,

  accessToken: {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    privateKey: env.ACCESS_TOKEN_PRIVATE_KEY,
    publicKey: env.ACCESS_TOKEN_PUBLIC_KEY,
  },

  refreshToken: {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    privateKey: env.REFRESH_TOKEN_PRIVATE_KEY,
    publicKey: env.REFRESH_TOKEN_PUBLIC_KEY,
  },

  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },

  redis: {
    url: env.REDIS_URL,
    cacheExpiresIn: env.REDIS_CACHE_EXPIRES_IN,
  },
}

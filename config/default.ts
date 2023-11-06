import dotenv from 'dotenv'

dotenv.config()

const { env } = process

export default {
  env: env.NODE_ENV,
  port: env.PORT,

  allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || [],

  flareSolverBaseUrl: env.FLARE_SOLVER_BASE_URL,
  yggBasePasskey: env.YGG_BASE_PASSKEY,
}

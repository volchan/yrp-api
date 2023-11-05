const { env } = process;

export default {
  env: env.NODE_ENV,
  port: env.PORT,

  allowedOrigins: env.ALLOWED_ORIGINS,

  flareSolverBaseUrl: env.FLARE_SOLVER_BASE_URL,
  yggBasePasskey: env.YGG_BASE_PASSKEY,
};

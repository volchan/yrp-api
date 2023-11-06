import morgan from 'morgan'

import logger from '@utils/logger'

const prodConfig = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)!),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)!),
    })
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: message => {
        const data = JSON.parse(message)
        logger.http(data)
      },
    },
  },
)

const devConfig = morgan('dev', { stream: { write: message => logger.http(message) } })

const morganMiddleware = process.env.NODE_ENV === 'production' ? prodConfig : devConfig

const startingRequestMiddleware = (req, res, next) => {
  logger.http(`Started ${req.method} ${req.url} ${req.ip}`)
  next()
}

export { morganMiddleware, startingRequestMiddleware }

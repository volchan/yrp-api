import config from 'config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import AppRouter from '@routes/app.router'
import errorHandlerMiddleware from '@middlewares/error-handler.middleware'
import logger from '@utils/logger'
import { morganMiddleware, startingRequestMiddleware } from '@middlewares/logger.middleware'
import { AppDataSource } from './data-source'
import { isProduction } from './utils'

AppDataSource.initialize()
  .then(() => {
    const app = express()

    app.use(cors({ origin: config.get<Array<string>>('allowedOrigins') }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())

    app.use(startingRequestMiddleware)
    app.use(morganMiddleware)
    app.use(AppRouter)
    app.use(errorHandlerMiddleware)

    const port = config.get<number>('port')

    app.listen(port, () => {
      if (isProduction) {
        logger.info(`🚀 Listening on port ${port}`)
      } else {
        logger.info(`🚀 Listening at http://localhost:${port}`)
      }
    })
  })
  .catch(err => {
    logger.error("Couldn't connect to the database")
    logger.error(err)
    logger.error(`DB_HOST: ${config.get<string>('db.host')}`)
    logger.error(`DB_PORT: ${config.get<number>('db.port')}`)
    logger.error(`DB_USERNAME: ${config.get<string>('db.username')}`)
    logger.error(`DB_PASSWORD: ${config.get<string>('db.password')}`)
    logger.error(`DB_DATABASE: ${config.get<string>('db.database')}`)

    process.exit(1)
  })

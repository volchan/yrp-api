import config from 'config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import audit from 'express-requests-logger'

import AppRouter from '@routes/app.router'
import errorHandlerMiddleware from '@middlewares/error-handler.middleware'
import { logger } from '@utils/logger'
import morganMiddleware from '@middlewares/morgan.middleware'

const app = express()

app.use(audit())
app.use(cors({ origin: config.get<Array<string>>('allowedOrigins') }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

app.use((req, res, next) => logger.http(`Started ${req.method} ${req.url}`) && next())
app.use(morganMiddleware)
app.use(AppRouter)
app.use(errorHandlerMiddleware)

const port = config.get<number>('port')

app.listen(port, () => {
  logger.http(`Listening at http://localhost:${port}`) // eslint-disable-line no-console
})

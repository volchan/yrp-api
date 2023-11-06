import config from 'config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import AppRouter from '@routes/app.router'
import errorHandlerMiddleware from '@middlewares/error-handler.middleware'
import { logger } from '@utils/logger'
import { morganMiddleware, startingRequestMiddleware } from '@middlewares/logger.middleware'

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
  logger.http(`Listening at http://localhost:${port}`)
})

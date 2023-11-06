import config from 'config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import AppRouter from '@routes/app.router'
import errorHandlerMiddleware from '@middlewares/error-handler.middleware'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())

app.use(AppRouter)
app.use(errorHandlerMiddleware)

const port = config.get<number>('port')

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`) // eslint-disable-line no-console
})

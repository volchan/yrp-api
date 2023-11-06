import config from 'config'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import DataSourceLogger from '@utils/datasource-logger'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.get<string>('db.host'),
  port: config.get<number>('db.port'),
  username: config.get<string>('db.username'),
  password: config.get<string>('db.password'),
  database: config.get<string>('db.database'),

  logging: true,
  logger: new DataSourceLogger(),
  synchronize: false,
  migrationsRun: true,
  installExtensions: true,
  uuidExtension: 'pgcrypto',
  namingStrategy: new SnakeNamingStrategy(),

  entities: [`${__dirname}/entities/*.ts`],
  migrations: [`${__dirname}/migrations/*.ts`],
})

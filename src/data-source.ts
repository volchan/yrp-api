import config from 'config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import DataSourceLogger from '@utils/datasource-logger'

const options: DataSourceOptions & SeederOptions = {
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
  seeds: [`${__dirname}/seeds/**/*.ts`],
  factories: [`${__dirname}/factories/**/*.ts`],
}

export const AppDataSource = new DataSource(options)

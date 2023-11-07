import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { User } from '@entities/user.entity'

export default class UserSeeder implements Seeder {
  public async run(_dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userFactory = await factoryManager.get(User)
    await userFactory.saveMany(5)
  }
}

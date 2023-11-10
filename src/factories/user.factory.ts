import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { UniqueEnforcer } from 'enforce-unique'

import { User } from '@entities/user.entity'
import Roles from '@utils/roles'

const uniqueEnforcer = new UniqueEnforcer()

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User()
  user.email = uniqueEnforcer.enforce(() => faker.internet.email())
  user.password = faker.internet.password()
  user.yggPasskey = faker.string.nanoid(25)
  user.role = Roles.USER
  return user
})

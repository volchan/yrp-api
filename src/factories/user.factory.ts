import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'

import { User } from '@entities/user.entity'

export default setSeederFactory(User, (faker: Faker) => {
  const user = new User()
  user.email = faker.internet.email()
  user.passwordHash = faker.internet.password()
  return user
})

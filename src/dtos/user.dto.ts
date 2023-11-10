import { Exclude, Expose } from 'class-transformer'

export class UserDTO {
  @Expose()
  id!: string

  @Expose()
  email!: string

  @Expose()
  yggPasskey!: string

  @Expose()
  role!: string

  @Exclude()
  password!: string
}

export class CreateUserDTO {
  @Expose()
  email!: string

  @Expose()
  password!: string
}

export class LoginUserDTO extends CreateUserDTO {}

export class UpdateUserDTO extends UserDTO {
  @Exclude()
  id!: string

  @Expose()
  password!: string

  @Exclude()
  role!: string
}

export class AdminUpdateUserDTO extends UpdateUserDTO {
  @Expose()
  role!: string
}

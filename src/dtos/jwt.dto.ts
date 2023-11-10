import { Expose } from 'class-transformer'

export class JwtDTO {
  @Expose()
  id!: string

  @Expose()
  iat!: number

  @Expose()
  exp!: number
}

export class CreateJwtTokenDTO {
  @Expose()
  id!: string
}

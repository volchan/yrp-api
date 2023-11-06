import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string

  @Column()
  passwordHash: string

  @Column({ nullable: true })
  yggPasskey: string
}

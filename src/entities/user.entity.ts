import { Column, Entity, Index } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity()
export class User extends BaseEntity {
  @Column()
  @Index({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column({ nullable: true })
  yggPasskey: string
}

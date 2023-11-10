import { BeforeInsert, Column, Entity, Index } from 'typeorm'

import { BaseEntity } from './base.entity'
import { hashPassword } from '@utils/jwt'
import Roles from '@utils/roles'

@Entity()
export class User extends BaseEntity {
  @Column()
  @Index({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  yggPasskey: string

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: string

  @BeforeInsert()
  sanitizeEmail(): void {
    this.email = this.email.trim().toLowerCase()
  }

  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    this.password = await hashPassword(this.password)
  }

  isAdmin(): boolean {
    return this.role === Roles.ADMIN
  }
}

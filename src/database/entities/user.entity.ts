import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Post } from './post.entity'

export enum Role {
  admin = 'admin',
  client = 'client',
}

// Excludes password so we don't select it or allow ordering by it
export const safeUserFields: Array<keyof Omit<User, 'password'>> = [
  'id',
  'name',
  'email',
  'role',
  'createdAt',
  'updatedAt',
]

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  name: string | null

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string

  @Column({
    type: 'varchar',
    length: 255,
    default: Role.client,
  })
  role: Role

  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

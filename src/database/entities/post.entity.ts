import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'text',
  })
  body: string | null

  @ManyToOne((type) => User, (user) => user.posts)
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

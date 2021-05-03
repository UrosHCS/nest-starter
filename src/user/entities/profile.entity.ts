import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

export enum Gender {
  male = 'male',
  female = 'female',
  // other types are not enumerated
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  gender: string | null

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: true,
  })
  phone: string

  @Column({
    type: 'varchar',
    length: 2047,
    nullable: true,
  })
  image: string

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

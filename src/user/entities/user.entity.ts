import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum Role {
  admin = 'admin',
  client = 'client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
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
    default: Role.client,
  })
  role: Role

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

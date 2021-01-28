import { User } from 'src/users/user.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('passwords')
export class Password {
  @PrimaryGeneratedColumn()
  id: number

  // The hashed password is stored in the "value" column
  @Column({
    type: 'varchar',
    length: 255,
  })
  value: string

  // Column userId is what is generated with the one to one relation with user.
  // The userId property just allows us to access it without loading the user
  // relation.
  @Column({ nullable: true })
  userId: number

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}

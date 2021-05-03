import { User } from 'src/user/entities/user.entity'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

export enum CredentialType {
  local = 'local', // password
  google = 'google',
  facebook = 'facebook',
}

@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'varchar',
    length: 255,
  })
  type: CredentialType

  // The hashed password, google user id or facebook user id
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

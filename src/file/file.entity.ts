import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum FileStorage {
  disk = 'disk',
  external = 'external',
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'string',
  })
  mimetype: string

  // Size of the file in bytes
  @Column({
    type: 'int',
  })
  size: number

  @Column({
    type: 'string',
  })
  path: string

  @Column({
    type: 'string',
  })
  storage: string
}

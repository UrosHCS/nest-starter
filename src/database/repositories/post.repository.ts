import { EntityRepository } from 'typeorm'
import { BaseRepository } from '../base.repository'
import { Post } from '../entities/post.entity'

@EntityRepository(Post)
export class PostRepository extends BaseRepository<Post> {}

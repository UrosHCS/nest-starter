import { faker as Faker } from '@faker-js/faker'
import { NoArgConstructor } from 'src/shared/common/no.arg.constructor'
import { getRepository } from 'typeorm'

// Entity attributes but can also contain a Factory
export type Attributes<E> = {
  [P in keyof E]?: Attribute<E, P>
}

// Entity attribute but can also be a Factory in some cases.
// If column property is one of the ColumnAttribute types then we can't have a factory for it.
// Otherwise it is a relation. And for some relations, a Factory is allowed.
type Attribute<E, P extends keyof E> = E[P] extends NestedFactoryNotAvailable
  ? E[P]
  : E[P] | RelationSpecificFactory<E, P>

// In typeorm column can be represented by some of the following types.
// Also, enums can be used, but we cannot add object type because
// relations are also of object type.
type ColumnAttribute = string | number | boolean | bigint | Date | null | undefined

// Factories can be nested for @ManyToOne relations and one side of a @OneToOne relation.
// We can filter other relations by not allowing factories for columns of type Array. The one side of
// a @OneToOne that can't have a nested factory is not filtered out - keep this in mind.
type NestedFactoryNotAvailable = ColumnAttribute | any[]

// Relation can be defined by its type or a factory of it. If the relation
// is an array, then the factory must be of the array element type.
type RelationSpecificFactory<E, P extends keyof E> = E[P] extends Array<infer U>
  ? FactoryInterface<U>
  : FactoryInterface<E[P]>

// The signature of the callback that creates the entity attributes.
export type FactoryMethod<E> = (
  faker: typeof Faker,
  attributes: Attributes<E>,
) => Attributes<E> | Promise<Attributes<E>>

// Creating one entity needs just attributes for it (which are actually optional)
type CreatorOfOne<E> = (attributes?: Attributes<E>) => Promise<E>

// Creating many entities needs an amount to create and optional attributes for them.
type CreatorOfMany<E> = (amount: number, attributes?: Attributes<E>) => Promise<E[]>

// Just to define the public api of the Factory
interface FactoryInterface<E> {
  create: CreatorOfOne<E>
  make: CreatorOfOne<E>
  createMany: CreatorOfMany<E>
  makeMany: CreatorOfMany<E>
  definition(attributes: Attributes<E>): Promise<Attributes<E>> | Attributes<E>
}

export abstract class BaseFactory<E> implements FactoryInterface<E> {
  protected faker = Faker
  protected attributes: Attributes<E> = {}
  protected abstract entityClass: NoArgConstructor<E>

  state(attributes: Attributes<E>) {
    Object.assign(this.attributes, attributes)

    return this
  }

  async create(attributes: Attributes<E> = {}): Promise<E> {
    const entity = await this.make(attributes)

    const repo = getRepository<E>(this.entityClass)

    await repo.insert(entity)

    return entity
  }

  async make(attributes: Attributes<E> = {}): Promise<E> {
    const entity = new this.entityClass()

    // First get the attributes from the defined factory.
    const factoryAttributes = await this.definition(attributes)

    // Then override them with the state attributes.
    // Then override them with the attributes passed to this method.
    attributes = { ...factoryAttributes, ...this.attributes, ...attributes }

    // Now fill the entity with attributes.
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        const attribute = attributes[key]

        if (attribute instanceof BaseFactory) {
          // We are gonna create() that relation even if only make() method was called.
          entity[key] = await attribute.create()
        } else {
          // TypeScript doesn't understand that if an Attribute<E> is not a Factory
          // it is then just "E[Extract<keyof E, string>]" so we need to tell it.
          entity[key] = attribute as E[Extract<keyof E, string>]
        }
      }
    }

    return entity
  }

  async createMany(amount: number, attributes: Attributes<E> = {}): Promise<E[]> {
    return await this.many('create', amount, attributes)
  }

  async makeMany(amount: number, attributes: Attributes<E> = {}): Promise<E[]> {
    return await this.many('make', amount, attributes)
  }

  private async many(
    creator: 'make' | 'create',
    amount: number,
    attributes: Attributes<E> = {},
  ): Promise<E[]> {
    const creations: Array<Promise<E>> = []

    while (amount--) {
      creations.push(this[creator](attributes))
    }

    return Promise.all(creations)
  }

  abstract definition(attributes: Attributes<E>): Promise<Attributes<E>> | Attributes<E>
}

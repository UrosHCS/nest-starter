import * as Faker from 'faker'
import { getRepository } from 'typeorm'

// Entity attributes but can also contain a FactoryBuilder
type Attributes<E> = {
  [P in keyof E]?: Attribute<E, P>
}

// Entity attribute but can also be a FactoryBuilder in some cases.
// If column property is one of the ColumnAttribute types then we can't have a factory for it.
// Otherwise it is a relation. And for some relations, a FactoryBuilder is allowed.
type Attribute<E, P extends keyof E> = E[P] extends NestedFactoryNotAvailable
  ? E[P]
  : E[P] | RelationSpecificFactoryBuilder<E, P>

// In typeorm column can be represented by some of the following types.
// Also, enums can be used, but we cannot add object type because
// relations are also of object type.
type ColumnAttribute = string | number | boolean | bigint | Date

// Factories can be nested only for @ManyToOne relations and also only one side of a @OneToOne relation.
// We can filter other relations by not allowing factories for columns of type Array. The one side of
// a @OneToOne that can't have a nested factory is not filtered out - keep this in mind.
type NestedFactoryNotAvailable = ColumnAttribute | any[]

// Relation can be defined by its type or a factory of it. If the relation
// is an array, then the factory must be of the array element type.
type RelationSpecificFactoryBuilder<E, P extends keyof E> = E[P] extends Array<infer U>
  ? FactoryBuilder<U>
  : FactoryBuilder<E[P]>

// The signature of the callback that creates the entity attributes.
export type FactoryMethod<E> = (
  faker: typeof Faker,
  attributes: Attributes<E>,
) => Attributes<E> | Promise<Attributes<E>>

export type EntityConstructor<E> = new () => E

// Creating one entity needs just attributes for it (which are actually optional)
type CreatorOfOne<E> = (attributes: Attributes<E>) => Promise<E>

// Creating many entities needs an amount to create and optional attributes for them.
type CreatorOfMany<E> = (amount: number, attributes: Attributes<E>) => Promise<E[]>

// Just to define the public api of the FactoryBuilder
interface FactoryBuilderInterface<E> {
  create: CreatorOfOne<E>
  make: CreatorOfOne<E>
  createMany: CreatorOfMany<E>
  makeMany: CreatorOfMany<E>
}

// This where we keep a list of defined factories.
const factories: { [key: string]: FactoryMethod<any> } = {}

// The function defines a factory for a single entity class
export const define = <E>(entityClass: EntityConstructor<E>, callback: FactoryMethod<E>): void => {
  if (factories[entityClass.name]) {
    throw new Error(`Factory for entity ${entityClass.name} is already defined.`)
  }

  factories[entityClass.name] = callback
}

// A helper function to make a factory builder
export const factory = <E>(entityClass: EntityConstructor<E>): FactoryBuilder<E> => {
  // Make sure the factory for entity is defined
  if (!factories[entityClass.name]) {
    throw new Error(`Factory for entity ${entityClass.name} is not defined.`)
  }

  return new FactoryBuilder<E>(entityClass, factories[entityClass.name])
}

export class FactoryBuilder<E> implements FactoryBuilderInterface<E> {
  constructor(public entityClass: EntityConstructor<E>, public factoryMethod: FactoryMethod<E>) {}

  async create(attributes: Attributes<E> = {}): Promise<E> {
    const entity = await this.make(attributes)

    const repo = getRepository<E>(this.entityClass)

    return await repo.save<E>(entity)
  }

  async make(attributes: Attributes<E> = {}): Promise<E> {
    const entity = new this.entityClass()

    // First get the attributes from the defined factory.
    const factoryAttributes = await this.factoryMethod(Faker, attributes)

    // Then override them with the attributes passed to this method.
    attributes = { ...factoryAttributes, ...attributes }

    // Now fill the entity with attributes.
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        const attribute = attributes[key]

        if (attribute instanceof FactoryBuilder) {
          // We are gonna create() that relation even if only make() method was called.
          entity[key] = await attribute.create()
        } else {
          // TypeScript doesn't understand that if an Attribute<E> is not a FactoryBuilder
          // it is then just "E[Extract<keyof E, string>]" so we need to tell it.
          entity[key] = attribute as E[Extract<keyof E, string>]
        }
      }
    }

    return entity
  }

  async createMany(amount: number, attributes: Attributes<E> = {}): Promise<E[]> {
    return await this.many(this.create, amount, attributes)
  }

  async makeMany(amount: number, attributes: Attributes<E> = {}): Promise<E[]> {
    return await this.many(this.make, amount, attributes)
  }

  private async many(
    creator: CreatorOfOne<E>,
    amount: number,
    attributes: Attributes<E> = {},
  ): Promise<E[]> {
    const entities: Array<Promise<E>> = []

    while (amount--) {
      entities.push(creator.bind(this)(attributes))
    }

    return Promise.all(entities)
  }
}

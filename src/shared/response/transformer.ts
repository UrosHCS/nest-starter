type ResponseBody = {
  data?: any
  [key: string]: any
}

interface TransformerInterface {
  toResponse: () => ResponseBody
  transform: () => any
}

type TransformerConstructor = new (resource: any) => TransformerInterface

/**
 * Use as a base class to make response objects
 */
export class Transformer implements TransformerInterface {
  constructor(
    /**
     * Resource should usually be an entity object,
     * but it can be any type.
     */
    public resource: any,
  ) {}

  static make<E>(resource: E) {
    return new this(resource).toResponse()
  }

  toResponse(): ResponseBody {
    return {
      data: this.transform()
    }
  }

  transform(): any {
    const ResourceClass = this.collectFrom()

    if (ResourceClass) {
      return this.transformCollection(ResourceClass)
    }

    return this.resource
  }

  protected transformCollection(ResourceClass: TransformerConstructor) {
    if (!Array.isArray(this.resource)) {
      throw new Error('Resource is not an array.')
    }

    return this.resource.map((item) => new ResourceClass(item).transform())
  }

  protected collectFrom(): TransformerConstructor | undefined {
    return undefined
  }
}

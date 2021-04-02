export class Column {
  protected name: string

  constructor(name: string) {
    this.name = name
  }

  getName(): string {
    return this.name
  }

  getPlaceholder(): string {
    return '?'
  }
}

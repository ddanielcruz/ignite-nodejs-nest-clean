import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID {
  private readonly value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? createId()
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}

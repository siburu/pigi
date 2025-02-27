export type HashFunction = (preimage: Buffer) => Buffer

export class CannotDecideError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

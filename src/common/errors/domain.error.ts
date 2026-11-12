/**
 * An error that is part of the application's behaviour (as opposed to a bug):
 * it is safe to show to a client and carries a stable machine-readable code.
 *
 * Services throw these instead of Nest's HTTP exceptions, so business logic
 * does not depend on the transport it happens to be served over.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
}

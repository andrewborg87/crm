export abstract class BaseEvent<T, M = unknown> {
  protected constructor(
    readonly data: T,
    readonly metadata?: M,
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

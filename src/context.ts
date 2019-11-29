export class Context<T> {
  private _context: T;

  public constructor(context: T) {
    this.init(context);
    this._context = context;
  }

  private init(context: T) {
    if (!(this instanceof Context)) {
      throw new Error(
        'Invalid using of context class. Probably missing "new" keyword.'
      );
    }
  }

  public context(): T {
    return this._context;
  }
}
/**
 * The interface of a plugin function, where
 * - `this` is context that has `TContext` type.
 * - `use` are arguments of use array
 *
 * ```
 * (this: TContext, ...use: any[]) => TResult
 * (this: TContext) => TResult
 * (...use: any[]) => TResult
 * ```
 *
 * A sample plugin of array numbers sum:
 * ```
 * function sum(this: number[]): number {
 *   return this.reduce((previousValue: number, currentValue: number): number => {
 *     return previousValue + currentValue;
 *   }, 0);
 * }
 *
 * var numbers = new Context([1, 2, 3, 4, 5]);
 * var takeSum = numbers.make(sum);
 * console.log(takeSum); // 15
 * ```
 *  */
export interface IPlugin<TContext, TResult> {
  (this: TContext, ...use: any[]): TResult;
}

/**
 * The interface of a plugin function, where
 * - `this` is Context<TContext> system
 * - `context` is the first variable
 * - `use` is the second variable
 *
 * ```
 * (this: Context<TContext>, context: TContext, use: any[]) => TResult;
 * (this: Context<TContext>, context: TContext) => TResult;
 * (this: Context<TContext>) => TResult;
 * (context: TContext, use: any[]) => TResult;
 * (context: TContext) => TResult;
 * ```
 *
 * A sample plugin of clearing "use" array
 * ```
 * function clearUse<TContext>(this: Context<TContext>, context: any, use: any[]): Context<TContext> {
 *   use.splice(0, use.length);
 *   return this;
 * }
 *
 * var attention = new Context({
 *   hello: 'world'
 * });
 *
 * attention
 *   .use(1,2,3)
 *   .scope(clearUse);
 * ```
 */
export interface IScope<TContext, TResult> {
  (this: Context<TContext>, context: TContext, use: any[]): TResult;
}

/**
 * The TypeScript ecosystem for an object. It allows add processing plugins to it.
 */
export class Context<TContext> {
  private _context: TContext;
  private _use: any[];

  /**
   * The context ecosystem. The wrapper of a context object.
   * @param context The context of an ecosystem
   *
   * Sample:
   * ```ts
   * var attention = new Context('This is a message');
   * console.log(attention.context()); // 'This is a message'
   * ```
   */
  public constructor(context: TContext) {
    this._use = [];
    this._context = context;
    this.init();
  }

  private init() {
    if (!(this instanceof Context)) {
      throw new Error(
        'Invalid using of context class. Probably missing "new" keyword.'
      );
    }
  }

  /**
   * Gets the context from a wrapper.
   *
   * Sample:
   * ```ts
   * var arr = new Context([1, 2, 3]);
   * console.log( arr.context() ); // [1, 2, 3]
   * ```
   * @returns context
   */
  public context(): TContext {
    return this._context;
  }

  /**
   * Change current context to a new one
   *
   * Sample:
   * ```
   * var arr = new Context([1, 2, 3]);
   * var changed = arr.change([4,5,6]);
   * console.log( arr === changed ); // true
   * console.log( arr.context() ); // [4,5,6]
   * ```
   * @param context new Context
   * @returns The context ecosystem
   */
  public change(context: TContext): Context<TContext> {
    this._context = context;
    return this;
  }

  /**
   * Add arguments of plugins execution
   *
   * Sample:
   * ```
   * function dialog(this: any, useQ: string, useA: string) {
   *   this.q(`${useQ} Hi, how are you doing?`);
   *   this.a(`${useA} Fine.`);
   *   this.q(`${useA} How's it going?`);
   *   this.a(`${useQ} Good`);
   * }
   *
   * var space = new Context({
   *   q: (msg: string) => { console.log(`Q: ${msg}`) },
   *   a: (msg: string) => { console.log(`A: ${msg}`) }
   * });
   *
   * space.use('Tom', 'Lisa').make(dialog);
   * ```
   *
   * @param args arguments to add
   * @returns The context ecosystem
   */
  public use(...args: any[]): Context<TContext> {
    this._use.push(...args);
    return this;
  }

  /**
   * Use this arguments of plugins execution
   * @param use the arguments to use
   * @returns The context ecosystem
   */
  public useArray(use: any[]): Context<TContext> {
    this._use = use;
    return this;
  }

  /**
   * Execute plugins functions — a tasks for a context
   * @param plugins Processing plugins
   * ```
   * (this: TContext, ...use: any[]) => void
   * ```
   * @returns The context ecosystem
   */
  public task(...plugins: IPlugin<TContext, void>[]): Context<TContext> {
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];
      plugin.apply(this._context, this._use);
    }
    return this;
  }

  /**
   * Execute plugin function and return the result of plugin processing
   * @param plugin Processing plugin
   * ```
   * (this: TContext, ...use: any[]) => TResult
   * ```
   * @returns The result of plugin processing
   */
  public make<TResult>(plugin: IPlugin<TContext, TResult>): TResult {
    return plugin.apply(this._context, this._use);
  }

  /**
   * Execute plugin and make new context, based on the plugin result
   * @param plugin Processing plugin
   * ```
   * (this: TContext, ...use: any[]) => TResult
   * ```
   * @returns New context, based on plugin result.
   */
  public map<TMappedContext>(
    plugin: IPlugin<TContext, TMappedContext>
  ): Context<TMappedContext> {
    return new Context(plugin.apply(this._context, this._use));
  }

  /**
   * Execute IScope processing plugin
   * @param plugin Processing plugin
   * ```
   * (this: Context<TContext>, context: TContext, use: any[]): TResult;
   * ```
   * @returns The result of the processing
   */
  public scope<TResult>(plugin: IScope<TContext, TResult>): TResult {
    return plugin.call(this, this._context, this._use);
  }
}

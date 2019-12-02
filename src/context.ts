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
 * Moves a first argument to a function context. This is conversion from a function to context based function.
 * @param func Function to convert
 * @returns A function, which context will be a first argument of a `func` parameter.
 */
export function lsh<TContext, TResult>(
  func: (context: TContext, ...args: any[]) => TResult
): IPlugin<TContext, TResult> {
  return function(this: TContext, ...use: any[]): TResult {
    return func(this, use);
  };
}

/**
 * Moves a function context to a first argument. This is conversion from context based function to a function.
 * @param plugin A context based function
 * @returns A function, which a first argument will be a context of a `plugin` parameter
 */
export function rsh<TContext, TResult>(
  plugin: IPlugin<TContext, TResult>
): (context: TContext, ...args: any[]) => TResult {
  return function(context: TContext, ...args: any[]): TResult {
    return plugin.call(context, args);
  };
}

/**
 * Converts a function to a context ecosystem plugin.
 * Sample
 * ```
 * let namespacePlugin = pluginize(namespace);
 * let obj = {};
 * let ns = new Context(obj).map(namespacePlugin("my.own.ns"));
 * console.log(obj);
 * ```
 * @param plugin Processing plugin
 */
export function pluginize<TContext, TResult>(
  plugin: IPlugin<TContext, TResult>
) {
  return function(...args: any[]): IPlugin<TContext, TResult> {
    return function() {
      return plugin.apply(this, args);
    };
  };
}

/**
 * The TypeScript ecosystem for an object. It allows to add processing plugins to it.
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
   * Uses "use" parameter for arguments of plugins execution instead of current Context class property _use.
   * @param use the arguments to use
   * @returns The context ecosystem
   */
  public useArray(use: any[]): Context<TContext> {
    this._use = use;
    return this;
  }

  /**
   * Execute plugins functions the tasks for a context
   * @param plugins Processing plugins
   * ```
   * (this: TContext, ...use: any[]) => void
   * ```
   * @returns The context ecosystem
   */
  public tasks(...plugins: IPlugin<TContext, void>[]): Context<TContext> {
    for (let i = 0; i < plugins.length; i++) {
      let plugin = plugins[i];
      plugin.apply(this._context, this._use);
    }
    this._use = [];
    return this;
  }

  /**
   * Execute plugin with params
   * @param plugin Processing plugin
   * ```
   * (this: TContext, ...use: any[]) => void
   * ```
   * @param use Arguments of a plugin
   * @returns The context ecosystem
   */
  public task(
    plugin: IPlugin<TContext, void>,
    ...use: any[]
  ): Context<TContext> {
    let args = use.length === 0 ? this._use : use;
    plugin.apply(this._context, args);
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
  public make<TResult>(
    plugin: IPlugin<TContext, TResult>,
    ...use: any[]
  ): TResult {
    let args = use.length === 0 ? this._use : use;
    let result = plugin.apply(this._context, args);
    this._use = [];
    return result;
  }

  /**
   * Executes plugin and make new context, based on the plugin result
   * @param plugin Processing plugin
   * ```
   * (this: TContext, ...use: any[]) => TResult
   * ```
   * @param use arguments of a plugin
   * @returns New context, based on plugin result.
   */
  public map<TMappedContext>(
    plugin: IPlugin<TContext, TMappedContext>,
    ...use: any[]
  ): Context<TMappedContext> {
    let args = use.length === 0 ? this._use : use;
    let result = new Context(plugin.apply(this._context, args));
    this._use = [];
    return result;
  }

  /**
   * Execute IScope processing plugin
   * @param plugin Processing plugin
   * ```
   * (this: Context<TContext>, context: TContext, use: any[]): TResult;
   * ```
   * @returns The result of the processing
   */
  public scope<TResult>(
    plugin: IScope<TContext, TResult>,
    ...use: any[]
  ): TResult {
    let args = use.length === 0 ? this._use : use;
    let result = plugin.call(this, this._context, this._use);
    return result;
  }
}

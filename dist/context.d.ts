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
export declare function pluginize<TContext, TResult>(plugin: IPlugin<TContext, TResult>): (...args: any[]) => IPlugin<TContext, TResult>;
/**
 * The TypeScript ecosystem for an object. It allows to add processing plugins to it.
 */
export declare class Context<TContext> {
    private _context;
    private _use;
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
    constructor(context: TContext);
    private init;
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
    context(): TContext;
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
    change(context: TContext): Context<TContext>;
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
    use(...args: any[]): Context<TContext>;
    /**
     * Use this arguments of plugins execution
     * @param use the arguments to use
     * @returns The context ecosystem
     */
    useArray(use: any[]): Context<TContext>;
    /**
     * Execute plugins functions — a tasks for a context
     * @param plugins Processing plugins
     * ```
     * (this: TContext, ...use: any[]) => void
     * ```
     * @returns The context ecosystem
     */
    tasks(...plugins: IPlugin<TContext, void>[]): Context<TContext>;
    /**
     * Execute plugin with params
     * @param plugin Processing plugin
     * ```
     * (this: TContext, ...use: any[]) => void
     * ```
     * @param use Arguments of a plugin
     * @returns The context ecosystem
     */
    task(plugin: IPlugin<TContext, void>, ...use: any[]): Context<TContext>;
    /**
     * Execute plugin function and return the result of plugin processing
     * @param plugin Processing plugin
     * ```
     * (this: TContext, ...use: any[]) => TResult
     * ```
     * @returns The result of plugin processing
     */
    make<TResult>(plugin: IPlugin<TContext, TResult>, ...use: any[]): TResult;
    /**
     * Execute plugin and make new context, based on the plugin result
     * @param plugin Processing plugin
     * ```
     * (this: TContext, ...use: any[]) => TResult
     * ```
     * @param use arguments of a plugin
     * @returns New context, based on plugin result.
     */
    map<TMappedContext>(plugin: IPlugin<TContext, TMappedContext>, ...use: any[]): Context<TMappedContext>;
    /**
     * Execute IScope processing plugin
     * @param plugin Processing plugin
     * ```
     * (this: Context<TContext>, context: TContext, use: any[]): TResult;
     * ```
     * @returns The result of the processing
     */
    scope<TResult>(plugin: IScope<TContext, TResult>, ...use: any[]): TResult;
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.iyuo = {}));
}(this, (function (exports) { 'use strict';

  /**
   * The TypeScript ecosystem for an object. It allows add processing plugins to it.
   */
  var Context = /** @class */ (function () {
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
      function Context(context) {
          this._use = [];
          this._context = context;
          this.init();
      }
      Context.prototype.init = function () {
          if (!(this instanceof Context)) {
              throw new Error('Invalid using of context class. Probably missing "new" keyword.');
          }
      };
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
      Context.prototype.context = function () {
          return this._context;
      };
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
      Context.prototype.change = function (context) {
          this._context = context;
          return this;
      };
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
      Context.prototype.use = function () {
          var _a;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          (_a = this._use).push.apply(_a, args);
          return this;
      };
      /**
       * Use this arguments of plugins execution
       * @param use the arguments to use
       * @returns The context ecosystem
       */
      Context.prototype.useArray = function (use) {
          this._use = use;
          return this;
      };
      /**
       * Execute plugins functions — a tasks for a context
       * @param plugins Processing plugins
       * ```
       * (this: TContext, ...use: any[]) => void
       * ```
       * @returns The context ecosystem
       */
      Context.prototype.task = function () {
          var plugins = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              plugins[_i] = arguments[_i];
          }
          for (var i = 0; i < plugins.length; i++) {
              var plugin = plugins[i];
              plugin.apply(this._context, this._use);
          }
          return this;
      };
      /**
       * Execute plugin function and return the result of plugin processing
       * @param plugin Processing plugin
       * ```
       * (this: TContext, ...use: any[]) => TResult
       * ```
       * @returns The result of plugin processing
       */
      Context.prototype.make = function (plugin) {
          return plugin.apply(this._context, this._use);
      };
      /**
       * Execute plugin and make new context, based on the plugin result
       * @param plugin Processing plugin
       * ```
       * (this: TContext, ...use: any[]) => TResult
       * ```
       * @returns New context, based on plugin result.
       */
      Context.prototype.map = function (plugin) {
          return new Context(plugin.apply(this._context, this._use));
      };
      /**
       * Execute IScope processing plugin
       * @param plugin Processing plugin
       * ```
       * (this: Context<TContext>, context: TContext, use: any[]): TResult;
       * ```
       * @returns The result of the processing
       */
      Context.prototype.scope = function (plugin) {
          return plugin.call(this, this._context, this._use);
      };
      return Context;
  }());

  exports.Context = Context;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=context.js.map

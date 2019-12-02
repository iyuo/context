(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.iyuo = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Moves a first argument to a function context. This is conversion from a function to context based function.
   * @param func Function to convert
   * @returns A function, which context will be a first argument of a `func` parameter.
   */
  function lsh(func) {
      return function () {
          var use = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              use[_i] = arguments[_i];
          }
          return func(this, use);
      };
  }
  /**
   * Moves a function context to a first argument. This is conversion from context based function to a function.
   * @param plugin A context based function
   * @returns A function, which a first argument will be a context of a `plugin` parameter
   */
  function rsh(plugin) {
      return function (context) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
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
  function pluginize(plugin) {
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return function () {
              return plugin.apply(this, args);
          };
      };
  }
  /**
   * The TypeScript ecosystem for an object. It allows to add processing plugins to it.
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
       * Uses "use" parameter for arguments of plugins execution instead of current Context class property _use.
       * @param use the arguments to use
       * @returns The context ecosystem
       */
      Context.prototype.useArray = function (use) {
          this._use = use;
          return this;
      };
      /**
       * Execute plugins functions the tasks for a context
       * @param plugins Processing plugins
       * ```
       * (this: TContext, ...use: any[]) => void
       * ```
       * @returns The context ecosystem
       */
      Context.prototype.tasks = function () {
          var plugins = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              plugins[_i] = arguments[_i];
          }
          for (var i = 0; i < plugins.length; i++) {
              var plugin = plugins[i];
              plugin.apply(this._context, this._use);
          }
          this._use = [];
          return this;
      };
      /**
       * Execute plugin with params
       * @param plugin Processing plugin
       * ```
       * (this: TContext, ...use: any[]) => void
       * ```
       * @param use Arguments of a plugin
       * @returns The context ecosystem
       */
      Context.prototype.task = function (plugin) {
          var use = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              use[_i - 1] = arguments[_i];
          }
          var args = use.length === 0 ? this._use : use;
          plugin.apply(this._context, args);
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
          var use = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              use[_i - 1] = arguments[_i];
          }
          var args = use.length === 0 ? this._use : use;
          var result = plugin.apply(this._context, args);
          this._use = [];
          return result;
      };
      /**
       * Executes plugin and make new context, based on the plugin result
       * @param plugin Processing plugin
       * ```
       * (this: TContext, ...use: any[]) => TResult
       * ```
       * @param use arguments of a plugin
       * @returns New context, based on plugin result.
       */
      Context.prototype.map = function (plugin) {
          var use = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              use[_i - 1] = arguments[_i];
          }
          var args = use.length === 0 ? this._use : use;
          var result = new Context(plugin.apply(this._context, args));
          this._use = [];
          return result;
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
          var use = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              use[_i - 1] = arguments[_i];
          }
          var args = use.length === 0 ? this._use : use;
          var result = plugin.call(this, this._context, this._use);
          return result;
      };
      return Context;
  }());

  exports.Context = Context;
  exports.lsh = lsh;
  exports.pluginize = pluginize;
  exports.rsh = rsh;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=context.js.map

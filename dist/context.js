(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.iyuo = {}));
}(this, (function (exports) { 'use strict';

  var Context = /** @class */ (function () {
      function Context(context) {
          this.init(context);
          this._context = context;
      }
      Context.prototype.init = function (context) {
          if (!(this instanceof Context)) {
              throw new Error('Invalid using of context class. Probably missing "new" keyword.');
          }
      };
      Context.prototype.context = function () {
          return this._context;
      };
      return Context;
  }());

  exports.Context = Context;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=context.js.map

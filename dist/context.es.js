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

export { Context };
//# sourceMappingURL=context.es.js.map

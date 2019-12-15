# context

[![NPM version](https://badge.fury.io/js/%40iyuo%2Fcontext.svg)](https://www.npmjs.com/package/@iyuo/context)
[![License](https://img.shields.io/github/license/iyuo/context)](https://github.com/iyuo/context/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40iyuo/context)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40iyuo/context)

The TypeScript ecosystem for an object. It allows to add processing plugins to it.

# Install

Node:

[![https://nodei.co/npm/@iyuo/context.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/@iyuo/context.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/@iyuo/context)

```shell
npm install @iyuo/context
```

[Browser](//iyuo.github.io/context/dist/context.js)

```html
<script src="//iyuo.github.io/context/dist/context.min.js"></script>
```

## Import package to the project

TypeScript:

```typescript
import { Context, pluginize, lsh, rsh } from "@iyuo/context";
```

or JavaScript:

```javascript
var iyuo = require("@iyuo/context");
var Context = iyuo.Context;
var pluginize = iyuo.pluginize;
var lsh = iyuo.lsh;
var rsh = iyuo.rsh;
```

# Documentation

Link: [https://iyuo.github.io/context/docs/index.html](https://iyuo.github.io/context/docs/index.html)

# Demo

See, how it's working: [https://runkit.com/lopatnov/context-demo](https://runkit.com/lopatnov/context-demo)

Test it with a runkit: [https://npm.runkit.com/@iyuo/context](https://npm.runkit.com/@iyuo/context)

# Plugins

- [namespace](https://iyuo.github.io/namespace/) Dynamic namespace creation
- [join](https://iyuo.github.io/join) Object join technics

## Example

```ts
function sum(this: number[]): number {
   return this.reduce((previousValue: number, currentValue: number): number => {
     return previousValue + currentValue;
   }, 0);
}

var numbers = new Context([1, 2, 3, 4, 5]);
var takeSum = numbers.make(sum);
console.log(takeSum); // 15
```

# Use cases

## class Context<TContext>

```ts
//A sample of a Context<TContext> class, this is the object Context<string>

let myContextSample = new Context("A sample context");
console.log(myContextSample);

/*
Context
  _context: "A sample context"
  _use: []
*/
```

### context(): TContext

```ts
// Gets the context from a wrapper

var sys = new Context({ hello: 'world' });
console.log(sys.context()); // Object {hello: "world"}

var arr = new Context([1, 2, 3]);
console.log(arr.context()); // [1, 2, 3]
```

### change(context: TContext): Context<TContext>

```ts
// Change current context to a new one

var arr = new Context([1, 2, 3]);
var changed = arr.change([4,5,6]);
console.log( arr === changed ); // true
console.log( arr.context() ); // [4,5,6]

var sys = new Context({ hello: 'world' });
console.log(sys.change({hello: 'friends'}).context()); //{hello: "friends"}
```

### use(...args: any[]): Context<TContext>

```ts
// Adds arguments of plugins execution

function dialog(useQ, useA) {
   this.q(`${useQ} Hi, how are you doing?`);
   this.a(`${useA} Fine.`);
   this.q(`${useA} How's it going?`);
   this.a(`${useQ} Good`);
}

var space = new Context({
   q: (msg) => { console.log(`Q: ${msg}`) },
   a: (msg) => { console.log(`A: ${msg}`) }
});

space.use('Tom', 'Lisa').make(dialog);
/*
"Q: Tom Hi, how are you doing?"
"A: Lisa Fine."
"Q: Lisa How's it going?"
"A: Tom Good"
*/

space.use('Ann').use('Nina').make(dialog);
/*
"Q: Ann Hi, how are you doing?"
"A: Nina Fine."
"Q: Nina How's it going?"
"A: Ann Good"
*/
```

### useArray(use: any[]): Context<TContext>

```ts
// Uses "use" parameter for arguments of plugins execution instead of current Context class property _use.

function strategy(teamA, teamB) {
    return function(behavior1, behavior2, behaviorDefault) {
        switch(this(teamA,teamB)) {
            case 1:
                return behavior1();
            case -1:
                return behavior2();
            default:
                return behaviorDefault();
        }
    }
}

function strategy1() {
    console.log('This is strategy1');
    return 1;
}

function strategy2() {
    console.log('This is strategy2');
    return 2;
}

function strategy3() {
    console.log('This is strategy3');
    return 3;
}

var space = new Context(function compare(a,b){
  var diff = a - b;
  return diff === 0 ? 0 : (diff > 0 ? 1 : -1);
});

space.useArray([strategy1, strategy2, strategy3]).make(strategy(3,4)); // "This is strategy2"
space.useArray([strategy1, strategy2, strategy3]).make(strategy(100,50)) // "This is strategy1"
space.useArray([strategy1, strategy2, strategy3]).make(strategy(100,100)) // "This is strategy3"
```

### tasks(...plugins: IPlugin<TContext, void>[]): Context<TContext>

```ts
// Execute plugins functions the tasks for a context

function or() {
 this.or = this.a | this.b;
}

function and() {
 this.and = this.a & this.b;
}

function xor() {
 this.xor = this.a ^ this.b;
}

var tasksDemo = new Context({a: true, b: false});
tasksDemo.tasks(or, and, xor);

console.log(tasksDemo.context());
/*
   Object
   a: true
   b: false
   and: 0
   or: 1
   xor: 1
*/

console.log(new Context({a: true, b: true}).tasks(and, xor).context());
/*
   Object
   a: true
   b: true
   and: 1
   xor: 0
*/
```

### task(plugin: IPlugin<TContext, void>, ...use: any[]): Context<TContext>

```ts
// Execute plugin with params

function not(comment) {
 console.log(`${comment}: ${!this.value}`);
 this.not = !this.value;
}

var taskDemo = new Context({value: false});
taskDemo.task(not, 'not this equals'); // "not this equals: true"

console.log(taskDemo.context()); // Object {not: true, value: false}

taskDemo.task(not, 'Repeat not 1'); // "Repeat not 1: true"
taskDemo.task(not, 'Repeat not 2'); // "Repeat not 2: true"

taskDemo.task(not, 'Same not task 1').task(not, 'Same not task 2');
/*
"Same not task 1: true"
"Same not task 2: true"
*/
```

### make<TResult>(plugin: IPlugin<TContext, TResult>, ...use: any[]): TResult

```ts
console.info('make<TResult>(plugin: IPlugin<TContext, TResult>, ...use: any[]): TResult');
console.info('Execute plugin function and return the result of plugin processing');

function sum() {
   return this.reduce((previousValue, currentValue) => {
     return previousValue + currentValue;
   }, 0);
}

var numbers = new Context([1, 2, 3, 4, 5]);
var takeSum = numbers.make(sum);
console.log(takeSum); // 15
```
### map<TMappedContext>(plugin: IPlugin<TContext, TMappedContext>, ...use: any[]): Context<TMappedContext>

```ts
console.info('map<TMappedContext>(plugin: IPlugin<TContext, TMappedContext>, ...use: any[]): Context<TMappedContext>');
console.info('Executes plugin and make new context, based on the plugin result');

function increment() {
 return this + 1;
}

var num = new Context(10);
console.log(num
    .map(increment)
    .map(increment)
    .map(increment)
    .map(increment)
    .context());
```

### scope<TResult>(plugin: IScope<TContext, TResult>, ...use: any[]): TResult

```ts
console.info('scope<TResult>(plugin: IScope<TContext, TResult>, ...use: any[]): TResult');
console.info('Execute IScope processing plugin');
console.info('IScope = (this: Context<TContext>, context: TContext, use: any[]): TResult');

function switchContextUse(context, use) {
    return new Context(use).use(context);
}

function eachFunc() {
    for (var index in this) {
        var f = this[index];
        if (f instanceof Function) {
            f.apply(this, arguments);
        }
    }
}

var c = new Context([1,2,3,4,5]);
c
.use(function(){ console.log('A: ', this, arguments) })
.use(function(){ console.log('B: ', this, arguments) })
.scope(switchContextUse)
.task(eachFunc);

console.log(c);
```

## pluginize<TContext, TResult>(plugin: IPlugin<TContext, TResult>): IPlugin<TContext, TResult>

```ts
console.info('pluginize<TContext, TResult>');
console.info('Converts a function to a context ecosystem plugin.');

function addFunction(n) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        arr.push(this[i] + n);
    }
    return arr;
}

var add = pluginize(addFunction);

var x = new Context([1,2,3,4,5]);

//You can use
console.log(x.map(addFunction, 10).context());

//But better looks
console.log(x.map(add(10)).context());
```

## lsh<TContext, TResult>(func: (context: TContext, ...args: any[]) => TResult): IPlugin<TContext, TResult>

```ts
console.info('lsh<TContext, TResult>(func: (context: TContext, ...args: any[]) => TResult): IPlugin<TContext, TResult>');
console.info('Moves a first argument to a function context. This is conversion from a function to context based function.');

function sub(a,b) {
  return a - b;
}

var s = lsh(sub);
console.log(s.call(10, 5));
```

## rsh<TContext, TResult>(plugin: IPlugin<TContext, TResult>): (context: TContext, ...args: any[]) => TResult

```ts
console.info('rsh<TContext, TResult>(plugin: IPlugin<TContext, TResult>): (context: TContext, ...args: any[]) => TResult');
console.info('Moves a function context to a first argument. This is conversion from context based function to a function.');

function stringify() {
  return '' + this;
}

var s = rsh(stringify);
console.log(s(12345));
```

# Rights and Agreements

License [Apache-2.0](https://github.com/iyuo/context/blob/master/LICENSE)

Copyright 2019 Oleksandr Lopatnov

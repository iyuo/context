# context

[![NPM version](https://badge.fury.io/js/%40iyuo%2Fcontext.svg)](https://www.npmjs.com/package/@iyuo/context)
[![License](https://img.shields.io/github/license/iyuo/context)](https://github.com/iyuo/context/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcontext)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcontext)

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
import { Context } from "@iyuo/context";
```

or JavaScript:

```javascript
var iyuo = require("@iyuo/context");
var Context = iyuo.Context;
```

# Documentation

Link: [https://iyuo.github.io/context/docs/index.html](https://iyuo.github.io/context/docs/index.html)

# Sample

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

# Rights and Agreements

License [Apache-2.0](https://github.com/iyuo/context/blob/master/LICENSE)

Copyright 2019 Oleksandr iyuo

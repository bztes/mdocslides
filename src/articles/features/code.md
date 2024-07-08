---
title: Code
description: Code block features
---

# Code Blocks

## Highlighting

Javascript

```js
function isAdult(person) {
  return person.age >= 18;
}

const person = { name: 'Alice', age: 25 };
console.log(isAdult(person));
```

Typescript

```ts
type Person = {
  name: string;
  age: number;
};

function isAdult(person: Person): boolean {
  return person.age >= 18;
}

const person: Person = { name: 'Alice', age: 25 };
console.log(isAdult(person));
```

## Set Title

```html:index.html
<html>
  <head></head>
  <body>
    <div>Hello FooBar</div>
  </body>
</html>
```

## Use Backticks

````html:doc.md
```
console.log('Foo');
```
````

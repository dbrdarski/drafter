# drafter.js
Work with immutable structures in mutable way

## drafter.createState
draft.createState enables you to create immutable state proxy and subscribe to it for changes:
```javascript
import { createState } from 'drafter';

const { state, subscribe } = createState(Object.freeze({
  a: 1,
  b: { c: { d: 2 }}
}));
```

The ```state``` is a proxy object to the immutable state object (tree). Invoking ```state``` with no arguments returns snapshot of the current state.
```javascript
let s1 = state(); // take snapshot
```

Let's create a render function that updates the dom and subscribe it to the state:
```javascript
const render = (state) => {
  document.body.innerHTML = `<pre>${JSON.stringify(state, null, 2)}</pre>`;
}

subscribe(render);
render();
```

Now let's try to mutate the state using the shorthand method.
```javascript
state.b.c.d = 4
let s2 = state();

console.log(s2);
// {
//   a: 1,
//   b: { c: { d: 4 } }
// }
//

s1 === s2 // false
```

Let's try to set ```state.a``` to 1, which is it's current value.

```javascript
state.a = 1;
let s3 = state();

s2 === s3 // true
```
The last two snapshots still are the same object since no effective state was changed.

```javascript
const s2 = state();
```

Now let's do some more complicated mutations. First add list property:
```javascript
state.list = [1,2,3];
```
For more complex changes to the state use an update function:
```javascript
state( draft => {
  delete draft.a
  draft.list.push(4,5);
  draft.b.c.d = { e: 10 };
});
let s4 = state();
console.log(s4);
// {
//   "b": {"c": {"d": {"e": 10 }}},
//   "list": [ 1, 2, 3, 4, 5 ]
// }
```
This will trigger the changes to the state into a single update.

## drafter.produce
Let's take a look at the ```produce``` function:
```javascript
import { produce } from 'drafter';

const oldState = {a: 1, list: [1, 2]};
const newState = produce( oldState, draft => {
  draft.a = { b: 2 };
  draft.list.push(3);
});
```

Currying is also supported with ```produce```:
```javascript
const updateFn = produce( draft => { ... });
const newState = updateFn(oldState);
```
This is really handy when wokring with React ```setState``` or Redux reducers.

Imagine something like this:
```javascript
...
this.setState( oldstate => {
  return {
    invoices: {
      ...oldstate.invoices,
      [id]: {
        ...oldstate.invoices[id],
        confirmed: true
      }
    }
  }
});
```
Would simply become:
```javascript
...
this.setState(
  produce( draft => {
    draft.invoices[id].confirmed = true;
  })
);
```

TODO: Redux example.

NOTE: This library is still work in progress.

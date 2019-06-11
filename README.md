# drafter
Work with immutable structures in mutable way

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
```

Let's try to set ```state.a``` to 1, which is it's current value.

```javascript
state.a = 1;
let s3 = state();

s1 === s2 // false
s2 === s3 // true
```
The last two snapshots still are the same object since no effective state was changed.

```javascript
const s2 = state();
```

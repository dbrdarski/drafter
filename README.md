# drafter
Work with immutable structures in mutable way

```html
import { createState } from 'drafter';

var { state, subscribe } = createState(Object.freeze({a: 1}));

var render = (state) => {
  document.body.innerHTML = `<pre>${JSON.stringify(state, null, 2)}</pre>`;
}
var s1 = state(); // take snapshot
subscribe(render);
render();
```

So let's try to mutate the state using the shorthand form.

```
state.b = { c: {d: 2}};
```
We can get a snapshot of current state by invoking state with no arguments:
```
var s1 = state();
```

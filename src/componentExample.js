JX.Component({
  props: {
  ...connectStore(SomeState, [ 'todos', 'focused' ]),
  JX.State({ state })
  },
  hooks: {

  }
})(({ state, updateState, SomeState }) => {
  return ();
});

import { VAT, SomeStore } from './stores';

export default ({ createState, connectStore, createEffect, mix }) => {

  const updateState = createState({
    count: 0,
    todos: [],
    isActive: false
  });

  connectStore(VAT, ['VATRate', 'VATCode', 'VATAmount']);
  connectStore(SomeStore, ({ one, two, mutli: { three, four } }) => ({ one, two, three, four }));

  // connect({
  //   state,
  //   ...,
  //   ...
  // });

  const onClick = (e) => {
    updateState(state => state.count++);
  };

  createEffect(({ state }) => {
    document.title = `You clicked ${state.count} times`;
  });

  return ({ state, attrs }) => {

  }
}

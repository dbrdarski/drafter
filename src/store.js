import { isCallable, isObject, empty, map, reduce } from './utils';
import { createObservable } from './observable';
import { createState } from './state';
import { dispatch } from './dispatch';

const id = x => x;

export const connectStoreFactory = ($instance) => (Store, mapper) => {
  const store = new Store;
  const mapFn = mapper ? resolveMapper(mapper) : false;

  store.subscribe((state) => {
    if(mapper)
      state = mapFn(state);
    $instance[Store.name] = (state);
  });

  store.getState(); // this will not work for re-initialized components
};

export const resolveMapper = (mapper) => {
  if (isCallable(mapper)){
    return mapper;
  } else if (Array.isArray(mapper)) {
    return (state) => {
      const s = empty(state);
      mapper.forEach( key => {
        s[key] = state[key];
      });
      return s;
    };
  } else {
    return id;
  }
};

export const Store = (name, { state, methods, computed }) => {
  const {$state, getState, ...stateProxy} = createState(state);
  const $methods = map(methods, method => ({ value: method.bind($state) }));
  const { message, subscribe, unsubscribe } = createObservable();

  class Store { };
  Store.toString = () => name;
  Object.assign(Store.prototype, { subscribe, unsubscribe, getState });
  Object.defineProperties(Store, {
    ...$methods,
    name: { value: name, enumerable: false }
  });

  stateProxy.subscribe(message);

  return Store;
};

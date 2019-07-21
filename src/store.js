import { isCallable, isObject, empty, reduce } from './utils';
import { createState } from './state';
import { dispatch } from './dispatch';

const id = x => x;

const connectStore = (componentInstance) => (store, mapper) => {

};

const componentInstance = () => {
  const instance = {
    attrs: { },
  };
  const methods = Object.defineProperties({ }, {
    createState: { get(){ } },
    createEffect: { get(){ } },
    connectStore: { get(){ } },
    mix: { get(){ } }
  });

  const { $state, subscribe } = createState(instance, { mutable: true });
  return {
    $state,
    subscribe,
    methods
  };
}

const mountComponent = (component) => {
  let cache;
  const clearCache = () => { cache = null };
  const { $state, subscribe, methods } = componentInstance();
  const render = component(methods);
  const unsubscribe = subscribe(clearCache);

  // return (vnode) => {
  //   if (cache == null){
  //     cache = render($state());
  //   }
  //   return cache;
  // };

  return {
    render(vnode){
      if (cache == null){
        cache = render($state());
      }
      return cache;
    }
    unmount(){
      unsubscribe();
    }
  }
}

const resolveMapper = (mapper) => {
  if (isCallable(mapper)){
    return (state) => mapper(state);
  } else if (Array.isArray(mapper)) {
    return (state) => {
      const s = empty(state);
      mapper.forEach( key => s[key] = state[key]);
      return Object.freeze(s);
    };
  } else {
    return id;
  }
};

const Store = (klass) => {
	const instance = new klass;
  const { subscribe, $state } = createState(instance);

  let listeners = [];

  const methods = reduce(klass.prototype, (acc, method => {
    isCallable(method) && acc.push(method.bind($state));
    return acc;
  }, []);

  const push = (state) => {
    listeners.forEach((fn) => {
      fn(state, methods);
    });
  };

  subscribe(push);
  subscribe(dispatch);

	return class {
		constructor(){
			return instance;
		}
		static toString(){
			return klass.toString();
		}
    static subscribe(fn){
      this.listeners = this.listeners.concat(fn);
      return () => {
        this.listeners = this.listeners.filter((f) => f !== fn);
      }
    }
    static unsubscribe(fn){
      this.listeners = this.listeners.filter((f) => f !== fn);
    }
	}
}



class VAT extends Store {
  VATRate = 0;
  VATAmount = 0;
  setVATAmount(value){
    this.VATAmount = value;
  }
  setVATRate(value){
    this.VATRate = value;
  }
}

const Store = (klass) => {
  const defaultState = Object.assign({ }, new klass);
  const { subscribe, getState, $state } = createState(defaultState, { mutable: true });
  subscribe(dispatch);
  const proto = reduce(klass.prototype, (acc, method => {
    isCallable(method) && acc.push(method.bind($state));
    return acc;
  }, []);
  return
  return {
    getState: () => ,
    subscribe
  }
}

const connector = (component) => (store, mapper) => {
  component.props[store.name] = ()
}

const connectStore = (componentInstance) => (store) => defaultState

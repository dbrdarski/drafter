import { createState } from './state';
import { connectStoreFactory } from './store';
import { dispatch } from './dispatch';

const componentInstance = (attrs, children) => {
  const instance = {
    state: null,
    attrs,
    children,
    refs: {},
  };
  const { $state, subscribe } = createState(instance, { mutable: true });
  const methods = Object.defineProperties({ }, {
    createState: { value: createStateFactory($state) },
    createEffect: { value(){ } },
    connectStore: { value: connectStoreFactory($state) },
    mix: { value(){ } }
  });

  return {
    $state,
    subscribe,
    methods
  };
};


const createStateFactory = ($instance) => (state) => {
  const { $state, subscribe, setState } = createState(state);
  $instance.state = state;
  subscribe((state) => { $instance.state = state; });
  return setState;
};

export const mountComponent = (component, attrs, children) => {
  // console.log("MOUNT")
  let cache;
  const clearCache = () => { cache = null };
  const { $state, subscribe, methods } = componentInstance(attrs, children);
  const render = component(methods);

  // const unsubscribe = subscribe(clearCache); // <- REAL problem maker!!!!

  subscribe(dispatch); // <- problem maker!!!!

  // return (vnode) => {
  //   if (cache == null){
  //     cache = render($state());
  //   }
  //   return cache;
  // };

  return {
    render(){
      if (cache == null){
        cache = render($state());
      }
      return cache;
    },
    unmount(){
      unsubscribe();
    }
  };
};

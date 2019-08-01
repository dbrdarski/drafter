export const createObservable = () => {
  let observers = [];
  const subscribe = (fn) => {
    observers = observers.concat(fn);
    return () => observers = observers.filter(l => l != fn)
  };
  const unsubscribe = (fn) => { observers = observers.filter(l => l != fn) };
  const message = (  msg  ) => {
		observers.map(
			(fn) => fn( msg )
		);
	};
  return {
    subscribe,
    unsubscribe,
    message
  };
}

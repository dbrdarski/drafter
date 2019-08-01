
export const { dispatch, connect } = (() => {
  let q = true;
  const a = [];
  return {
    connect(handler){
      a.push(handler);
      console.log(a);
    },
    dispatch(){
      console.log({ q });
      // debugger;
      q && a.forEach(handler => {
        console.log('DISPATCHING!')
        setTimeout(() => {
          console.log('DISPATCH DONE!!!!', q)
          q = true;
          handler();
        }, 0);
      });
      // q = false;
    }
  }
})();

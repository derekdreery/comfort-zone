let fns = new Set();
let debounce = false;

/**
 * If you pass two functions which are the same object, it will only
 * be called once
 */
export function fastDebounce(cb) {
  fns.add(cb);
  if(debounce === false) {
    debounce = true;
    window.requestAnimationFrame(() => {
      if(debounce) {
        debounce = false;
        fns.forEach((cb) =>{
          cb();
        });
        fns.clear();
      }
    });
  }
}

import invariant from 'invariant';

export default class Store {
  constructor() {
    this._cbs = new Set();
  }

  /*
   * Add a listener for this store
   */
  register(cb) {
    this._cbs.add(cb);
  }

  /**
   * Remove a registered listener for this store
   */
  unregister(cb) {
    this._cbs.remove(cb);
  }
}

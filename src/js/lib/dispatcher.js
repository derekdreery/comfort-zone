import invariant from 'invariant';

const _prefix = "ID_";

export default class Dispatcher {
  /**
   * General setup
   */
  constructor() {
    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastId = 1;
  }

  /**
   * Register a callback for dispatch
   */
  register(callback) {
    let id = _prefix + this._lastId++;
    this._callbacks[id] = callback;
    return id;
  }

  /**
   * Unregister a callback for dispatch
   */
  unregister(id) {
    invariant(
      this._callbacks[id],
      'Dispatcher.unregister(...); Trying to unregister %s, which is not registered',
      id
    );
    delete this._callbacks[id];
  }

  /**
   * Watit for a given set of callback ids
   */
  waitFor(ids) {
    invariant(
      this._isDispatching,
      "Dispatcher.waitFor: cannot waitfor outside of dispatch"
    );
    for(var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if(this._isPending[id]) {
        invariant(
          this._isHandled[id],
          'Dispatcher.waitFor: Circular dependency detected'
        );
        continue;
      }
      invariant(
        this._callbacks[id],
        'Dispatcher.waitFor: waiting for non-existent ID %s',
        id
      );
      this._invokeCallback(id);
    }
  }

  /**
   * Begin dispatch
   */
  dispatch(payload) {
    invariant(
      !this._isDispatching,
      'Dispatcher.dispatch: already dispatching'
    );
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if(this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  }

  /**
   * Call the callback stored with the given ID, and track internal
   * state for error reporting
   */
  _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  }

  /**
   * Track internal state for error reporting
   */
  _startDispatching(payload) {
    for(var id in this._callbacks) {
      this._isPending[id] = false;
      this._isPending[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  }

  /**
   * Clean up internal state
   */
   _stopDispatching() {
     delete this._pendingPayload;
     this._isDispatching = false;
   }
}

class Observer {

  addObserver(event, fn) {
    if (!this._events) { this._events = {}; }
    if (!this._events[event]) { this._events[event] = []; }
    return this._events[event].push(fn);
  }

  removeObserver(event, fn) {
    if (!this._events) { this._events = {}; }

    if (this._events[event]) {
      return this._events[event].splice(this._events[event].indexOf(fn), 1);
    }
  }

  notifyObservers(event, ...args) {
    if (!this._events) { this._events = {}; }

    if (this._events[event]) {
      return Array.from(this._events[event]).map((callback) =>
        callback.apply(this, args));
    }
  }

  getObservers() {
    return this._events;
  }
}

module.exports = Observer;

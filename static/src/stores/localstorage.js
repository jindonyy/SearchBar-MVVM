export class LocalStorage {
  #storageKey = '';

  constructor(key) {
    this.#storageKey = key;
    this.state = this.initState();
    this.observer = new Set();
  }

  initState() {
    const StorageItems = localStorage.getItem(this.#storageKey);
    return StorageItems;
  }

  convertState(newState) {
    const state = this.state ? this.state.concat(',', newState) : newState;
    return state;
  }

  setState(newState) {
    this.state = this.convertState(newState);
    localStorage.setItem(this.#storageKey, this.state);
  }

  removeState() {
    this.state = null;
    localStorage.removeItem(this.#storageKey);
  }

  addObserver(subscriber) {
    this.observer.add(subscriber);
  }

  observe(newState) {
    newState ? this.setState(newState) : this.removeState();
    this.observer.forEach(subscriber => {
      subscriber.notify(this.state);
    });
  }
}

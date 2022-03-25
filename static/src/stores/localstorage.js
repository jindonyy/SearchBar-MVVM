export class localstorage {
  #storageKey = '';

  constructor(key) {
    this.storage = localStorage;
    this.#storageKey = key;
  }

  getState() {
    const StorageItems = this.storage.getItem(this.#storageKey);
    return StorageItems ? StorageItems.split(',') : null;
  }

  setState(state) {
    this.storage.setItem(this.#storageKey, state);
  }

  removeState() {
    this.storage.removeItem(this.#storageKey);
  }
}

import { LocalStorage } from '../stores/LocalStorage.js';

export class RecentSearchKeywordsViewModel {
  constructor() {
    this.RECENT_KEYWORDS_STORAGE_KEY = 'recentSearchKeywords';
    this.store = new LocalStorage(this.RECENT_KEYWORDS_STORAGE_KEY);
    const initStoreState = this.store.initState();
    this.state = this.convertStoreState(initStoreState);
    this.observer = new Set();
    this.store.addObserver(this);
  }

  convertStoreState(storeState) {
    const state = storeState ? storeState.split(',') : [];
    return state;
  }

  setState(storeState) {
    this.state = this.convertStoreState(storeState);
  }

  addObserver(subscriber) {
    this.observer.add(subscriber);
  }

  observe(value) {
    this.store.observe(value);
  }

  notify(storeState) {
    this.observer.forEach(subscriber => {
      this.setState(storeState);
      subscriber.render(this.state);
    });
  }
}

import { LocalStorage } from '../../../stores/LocalStorage.js';

export class RecentSearchKeywordsViewModel {
  constructor() {
    const RECENT_KEYWORDS_STORAGE_KEY = 'recentSearchKeywords';
    this.store = new LocalStorage(RECENT_KEYWORDS_STORAGE_KEY);
    this.state = this.convertStoreState();
    this.store.addObserver(this);
    this.observers = new Set();
  }

  setState(storeState) {
    this.state = this.convertStoreState(storeState);
  }

  convertStoreState(storeState = this.store.state) {
    const state = storeState ? storeState.split(',') : [];
    return state;
  }

  addObserver(observer) {
    this.observers.add(observer);
  }

  observe(value) {
    this.store.observe(value);
  }

  notify(storeState) {
    this.setState(storeState);
    this.observers.forEach(observer => {
      observer.render(this.state);
    });
  }
}

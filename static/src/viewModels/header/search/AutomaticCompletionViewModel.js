import { FetchStore_GET } from '../../../stores/fetchStore_GET.js';

export class AutomaticCompletionViewModel {
  constructor() {
    this.store = new FetchStore_GET();
    this.state = [];
    this.observers = new Set();
    this.store.addObserver(this);
  }

  setState(storeState, value) {
    this.state = this.convertStoreState(storeState, value);
  }

  convertStoreState(storeState, value) {
    const valueMatchData = storeState.products.filter(product => product.keyword.match(value));
    const automaticCompletionDataLength = 6;
    const topViewData = valueMatchData.sort((a, b) => b.view - a.view).slice(0, automaticCompletionDataLength);
    return topViewData;
  }

  addObserver(observer) {
    this.observers.add(observer);
  }

  observe(value) {
    const SEARCH_STRORE_PATH = 'search';
    this.store.observe(SEARCH_STRORE_PATH, value);
  }

  notify(storeState, value) {
    this.setState(storeState, value);
    this.observers.forEach(observer => {
      observer.render(this.state, value);
    });
  }
}

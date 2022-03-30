import { fetchData } from '../utils/fetch.js';

export class FetchStore_GET {
  constructor() {
    this.state;
    this.observers = new Set();
  }

  async getState(path) {
    const automaticCompletionData = await fetchData(path);
    return automaticCompletionData;
  }

  async setState(path) {
    this.state = await this.getState(path);
  }

  addObserver(observer) {
    this.observers.add(observer);
  }

  async observe(path, value) {
    if (!this.state) await this.setState(path); // 검색 내역 데이터가 크므로 초기 한번만 fetch 하도록
    this.observers.forEach(observer => {
      observer.notify(this.state, value);
    });
  }
}

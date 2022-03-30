export class FetchStore_GET {
  constructor() {
    this.state;
    this.observers = new Set();
  }

  async fetchData(path) {
    const FULL_URL = 'http://localhost:3000/' + path;
    const response = await fetch(FULL_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async getState(path) {
    const automaticCompletionData = await this.fetchData(path);
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

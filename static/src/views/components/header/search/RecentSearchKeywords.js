export class RecentSearchKeywords {
  constructor(searchStorage) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$recentKeywordsWrap = this.$searchWrap.querySelector('.search-recent-keywords-wrap');
    this.$recentKeywords = this.$recentKeywordsWrap.querySelector('.search-recent-keywords');
    this.searchStorage = searchStorage;
  }

  connect(searchBar) {
    this.searchBar = searchBar;
  }

  render() {
    this.$recentKeywords.innerHTML = '';
    const recentKeywordsData = this.searchStorage.getState();
    if (!recentKeywordsData) return;
    const recentKeywordsTemplate = recentKeywordsData
      .map(
        keyword => `<li>
                      <a href="javascript:;"}"><span>${keyword}</span></a>
                      <button type="button" class="delete-button">삭제</button>
                    </li>`
      )
      .join('');
    this.$recentKeywords.insertAdjacentHTML('afterbegin', recentKeywordsTemplate);
  }

  show() {
    this.$recentKeywordsWrap.classList.add('active');
  }

  hide() {
    this.$recentKeywordsWrap.classList.remove('active');
  }

  showRecentKeywords() {
    if (this.$recentKeywordsWrap.querySelectorAll('li').length) this.show();
  }

  saveRecentSearchKeyword(searchValue) {
    if (!searchValue) return;
    const recentKeywordsData = this.searchStorage.getState();
    const recentKeywords = new Set(recentKeywordsData ? recentKeywordsData : []);
    recentKeywords.add(searchValue);
    this.searchStorage.setState([...recentKeywords]);
  }

  addAllDeleteButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('mousedown', () => {
      this.searchStorage.removeState();
      this.$recentKeywordsWrap.classList.remove('active');
      this.render();
    });
  }

  addSwitchButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.switch-button').addEventListener('mousedown', () => {
      this.$recentKeywordsWrap.classList.remove('active');
    });
  }

  addEventListener() {
    this.addAllDeleteButtonEvent();
    this.addSwitchButtonEvent();
  }

  init(searchBar) {
    this.connect(searchBar);
    this.render();
    this.addEventListener();
  }
}

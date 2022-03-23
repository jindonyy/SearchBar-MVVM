export class RecentSearchKeywords {
  constructor(RECENT_KEYWORDS_STORAGE_KEY, searchStorage) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$recentKeywordsWrap = this.$searchWrap.querySelector('.search-recent-keywords-wrap');
    this.$recentKeywords = this.$recentKeywordsWrap.querySelector('.search-recent-keywords');
    this.RECENT_KEYWORDS_STORAGE_KEY = RECENT_KEYWORDS_STORAGE_KEY;
    this.searchStorage = searchStorage;
  }

  connect(searchBar) {
    this.searchBar = searchBar;
  }

  render() {
    this.$recentKeywords.innerHTML = '';
    const recentKeywordsData = this.searchStorage.getItem(this.RECENT_KEYWORDS_STORAGE_KEY);
    if (!recentKeywordsData) return;
    const recentKeywordsTemplate = recentKeywordsData
      .split(',')
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
    const recentKeywordsData = this.searchStorage.getItem(this.RECENT_KEYWORDS_STORAGE_KEY);
    const recentKeywords = new Set(recentKeywordsData ? recentKeywordsData.split(',') : '');
    recentKeywords.add(searchValue);
    this.searchStorage.setItem(this.RECENT_KEYWORDS_STORAGE_KEY, [...recentKeywords]);
  }

  addAllDeleteButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('mousedown', () => {
      this.searchStorage.removeItem(this.RECENT_KEYWORDS_STORAGE_KEY);
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

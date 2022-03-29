import { RecentSearchKeywordsViewModel } from '../../../../viewModels/RecentSearchKeywordsViewModel.js';

export class RecentSearchKeywords {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$recentKeywordsWrap = this.$searchWrap.querySelector('.search-recent-keywords-wrap');
    this.$recentKeywords = this.$recentKeywordsWrap.querySelector('.search-recent-keywords');
    this.viewModel = new RecentSearchKeywordsViewModel();
  }

  connect(searchBar) {
    this.searchBar = searchBar;
  }

  render(state = this.viewModel.state) {
    this.$recentKeywords.innerHTML = '';
    if (!state) return;
    const recentKeywordsTemplate = state
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
    this.viewModel.observe(searchValue);
  }

  addAllDeleteButtonEvent() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('mousedown', () => {
      this.viewModel.observe(null);
      this.$recentKeywordsWrap.classList.remove('active');
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
    this.viewModel.addObserver(this);
  }
}

import { RecentSearchKeywordsViewModel } from '../../../../viewModels/header/RecentSearchKeywordsViewModel.js';

export class RecentSearchKeywords {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$recentKeywordsWrap = this.$searchWrap.querySelector('.search-recent-keywords-wrap');
    this.$recentKeywords = this.$recentKeywordsWrap.querySelector('.search-recent-keywords');
    this.viewModel = new RecentSearchKeywordsViewModel();
    this.init();
  }

  render(props = this.viewModel.state) {
    this.$recentKeywords.innerHTML = '';
    if (!props) return;
    const recentKeywordsTemplate = props
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
    if (this.hasRecentKeywords()) this.$recentKeywordsWrap.classList.add('active');
  }

  hide() {
    this.$recentKeywordsWrap.classList.remove('active');
    this.inactiveWord();
  }

  hasRecentKeywords() {
    return this.$recentKeywordsWrap.querySelectorAll('li').length ? true : false;
  }

  activeWord(index) {
    const activeWord = this.$recentKeywords.querySelectorAll('li')[index];
    if (activeWord) activeWord.classList.add('active');
  }

  inactiveWord() {
    const activeWord = this.$recentKeywords.querySelector('li.active');
    if (activeWord) activeWord.classList.remove('active');
  }

  getWordList() {
    const wordList = this.$recentKeywords.querySelectorAll('li');
    return wordList;
  }

  getActiveWord(index) {
    const searchPopWordList = this.getWordList();
    const activeWord = searchPopWordList[index].querySelector('span').textContent;
    return activeWord;
  }

  observe(searchValue) {
    this.viewModel.observe(searchValue);
  }

  addAllDeleteButtonEventListener() {
    this.$recentKeywordsWrap.querySelector('.all-delete-button').addEventListener('mousedown', () => {
      this.viewModel.observe(null);
      this.$recentKeywordsWrap.classList.remove('active');
    });
  }

  addSwitchButtonEventListener() {
    this.$recentKeywordsWrap.querySelector('.switch-button').addEventListener('mousedown', () => {
      this.$recentKeywordsWrap.classList.remove('active');
    });
  }

  addEventListener() {
    this.addAllDeleteButtonEventListener();
    this.addSwitchButtonEventListener();
  }

  init() {
    this.render();
    this.addEventListener();
    this.viewModel.addObserver(this);
  }
}

import { AutomaticCompletionViewModel } from '../../../../viewModels/header/AutomaticCompletionViewModel.js';

export class AutomaticCompletion {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$automaticCompletionWrap = this.$searchWrap.querySelector('.search-automatic-completion-wrap');
    this.$automaticCompletion = this.$automaticCompletionWrap.querySelector('.search-automatic-completion');
    this.viewModel = new AutomaticCompletionViewModel();
    this.init();
  }

  hasSearchValue(currentSearchData, searchValue) {
    return currentSearchData.length && searchValue ? true : false;
  }

  highlightSearchValue(searchValue, currentSearchKeyword) {
    return currentSearchKeyword.replace(searchValue, `<b>${searchValue}</b>`);
  }

  render(props, searchValue) {
    this.$automaticCompletion.innerHTML = '';
    if (!this.hasSearchValue(props, searchValue)) {
      this.$automaticCompletionWrap.classList.remove('active');
      return;
    }
    const automaticCompletionWordTemplate = props
      .map(searchKeyword => {
        const currentSearchKeyword = this.highlightSearchValue(searchValue, searchKeyword.keyword);
        return `<li>
                  <a href="javascript:;"><span>${currentSearchKeyword}</span></a>
                </li>`;
      })
      .join('');
    this.$automaticCompletion.insertAdjacentHTML('afterbegin', automaticCompletionWordTemplate);
    this.show();
  }

  activeWord(index) {
    const activeWord = this.$automaticCompletion.querySelectorAll('li')[index];
    if (activeWord) activeWord.classList.add('active');
  }

  inactiveWord() {
    const activeWord = this.$automaticCompletion.querySelector('li.active');
    if (activeWord) activeWord.classList.remove('active');
  }

  show() {
    this.$automaticCompletionWrap.classList.add('active');
  }

  hide() {
    this.$automaticCompletionWrap.classList.remove('active');
    this.inactiveWord();
  }

  getWordList() {
    const wordList = this.$automaticCompletion.querySelectorAll('li');
    return wordList;
  }

  getActiveWord(index) {
    const wordList = this.getWordList();
    const activeWord = wordList[index].querySelector('span').textContent;
    return activeWord;
  }

  observe(searchValue) {
    this.viewModel.observe(searchValue);
  }

  init() {
    this.viewModel.addObserver(this);
  }
}

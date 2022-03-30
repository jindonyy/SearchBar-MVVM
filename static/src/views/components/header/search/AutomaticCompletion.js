import { AutomaticCompletionViewModel } from '../../../../viewModels/header/AutomaticCompletionViewModel.js';

export class AutomaticCompletion {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$automaticCompletionWrap = this.$searchWrap.querySelector('.search-automatic-completion-wrap');
    this.$automaticCompletion = this.$automaticCompletionWrap.querySelector('.search-automatic-completion');
    this.viewModel = new AutomaticCompletionViewModel();
    this.init();
  }

  hasSearchValue(searchValue, currentSearchData) {
    return searchValue && currentSearchData ? true : false;
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
  }

  show() {
    if (this.hasAutomaticCompletionWord()) this.$automaticCompletionWrap.classList.add('active');
  }

  hide() {
    this.$automaticCompletionWrap.classList.remove('active');
    this.inactiveWord();
  }

  hasAutomaticCompletionWord() {
    return this.$automaticCompletionWrap.querySelectorAll('li').length ? true : false;
  }

  activeWord(index) {
    const activeWord = this.$automaticCompletion.querySelectorAll('li')[index];
    if (activeWord) activeWord.classList.add('active');
  }

  inactiveWord() {
    const activeWord = this.$automaticCompletion.querySelector('li.active');
    if (activeWord) activeWord.classList.remove('active');
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

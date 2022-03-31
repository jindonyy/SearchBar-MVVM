export class SearchBar {
  constructor(RecentSearchKeywords, AutomaticCompletion) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$searchInput = this.$searchWrap.querySelector('.search-input');
    this.recentSearchKeywords = RecentSearchKeywords;
    this.automaticCompletion = AutomaticCompletion;
    this.searchValue = null;
    this.activedSearchPop = null;
    this.foucsedSearchWordIndex = -1;
    this.init();
  }

  addSearchInputFocusEventListener() {
    this.$searchInput.addEventListener('focus', () => {
      if (this.searchValue) {
        this.automaticCompletion.observe(this.searchValue);
        this.activedSearchPop = this.automaticCompletion;
      } else {
        this.recentSearchKeywords.show();
        this.activedSearchPop = this.recentSearchKeywords;
      }
    });
  }

  addSearchValueSubmitEventListener() {
    this.$searchWrap.querySelector('form').addEventListener('submit', () => {
      if (!this.searchValue) return;
      this.recentSearchKeywords.observe(this.searchValue);
    });
  }

  showAutomaticCompletionPop() {
    this.recentSearchKeywords.hide();
    this.automaticCompletion.observe(this.searchValue);
    this.automaticCompletion.show();
    this.activedSearchPop = this.automaticCompletion;
    this.foucsedSearchWordIndex = -1;
  }

  showRecentSearchKeywordsPop() {
    this.automaticCompletion.hide();
    this.recentSearchKeywords.show();
    this.activedSearchPop = this.recentSearchKeywords;
  }

  addSearchValueInputEventListener() {
    this.$searchInput.addEventListener('input', async event => {
      const key = event.key || event.keyCode;
      if (['ArrowDown', 'ArrowUp'].includes(key)) return;

      this.searchValue = this.$searchInput.value;
      this.searchValue ? this.showAutomaticCompletionPop() : this.showRecentSearchKeywordsPop();
    });
  }

  isPointerOnSearchPop() {
    return this.foucsedSearchWordIndex >= 0 ? true : false;
  }

  isPointerOnSearchPopEnd() {
    const searchPopWordList = this.activedSearchPop.getWordList();
    return this.foucsedSearchWordIndex > searchPopWordList.length - 1 ? true : false;
  }

  updateSearchValue() {
    const activedWord = this.activedSearchPop.getActiveWord(this.foucsedSearchWordIndex);
    this.$searchInput.value = activedWord;
  }

  inactivateWordInSearchPop() {
    if (this.isPointerOnSearchPop()) this.activedSearchPop.inactiveWord(this.foucsedSearchWordIndex);
  }

  moveActivePointerToUp() {
    this.foucsedSearchWordIndex--;
    if (this.isPointerOnSearchPop()) {
      this.updateSearchValue();
      this.activedSearchPop.activeWord(this.foucsedSearchWordIndex);
    } else this.$searchInput.value = this.searchValue;
  }

  moveActivePointerToDown() {
    this.foucsedSearchWordIndex++;
    if (this.isPointerOnSearchPopEnd()) this.foucsedSearchWordIndex = 0;
    this.updateSearchValue();
    this.activedSearchPop.activeWord(this.foucsedSearchWordIndex);
  }

  activeSearchPopWord(key) {
    if (!this.activedSearchPop) this.inactivateWordInSearchPop();
    this.activedSearchPop.inactiveWord();
    switch (key) {
      case 'ArrowUp':
        if (this.isPointerOnSearchPop()) this.moveActivePointerToUp();
        break;
      case 'ArrowDown':
        this.moveActivePointerToDown();
        break;
    }
  }

  addSearchInputKeyDownEventListner() {
    this.$searchInput.addEventListener('keydown', event => {
      const key = event.key || event.keyCode;
      if (event.isComposing || !['ArrowDown', 'ArrowUp'].includes(key) || !this.activedSearchPop) return;

      event.preventDefault();
      this.activeSearchPopWord(key);
    });
  }

  addSearchBarBlurEventListner() {
    this.$searchInput.addEventListener('blur', () => {
      this.recentSearchKeywords.hide();
      this.automaticCompletion.hide();
      this.activedSearchPop = null;
    });
  }

  addEventListener() {
    this.addSearchInputFocusEventListener();
    this.addSearchValueSubmitEventListener();
    this.addSearchValueInputEventListener();
    this.addSearchInputKeyDownEventListner();
    this.addSearchBarBlurEventListner();
  }

  init() {
    this.addEventListener();
  }
}

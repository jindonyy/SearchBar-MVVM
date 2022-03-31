export class SearchBar {
  constructor(RecentSearchKeywords, AutomaticCompletion) {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$searchInput = this.$searchWrap.querySelector('.search-input');
    this.recentSearchKeywords = RecentSearchKeywords;
    this.automaticCompletion = AutomaticCompletion;
    this.searchValue = null;
    this.searchPopInfo = {
      activePop: null,
      currentIndex: -1,
      previousValue: ''
    };
    this.init();
  }

  addSearchInputFocusEventListener() {
    this.$searchInput.addEventListener('focus', () => {
      if (this.searchValue) {
        this.automaticCompletion.observe(this.searchValue);
        this.searchPopInfo.activePop = this.automaticCompletion;
      } else {
        this.recentSearchKeywords.show();
        this.searchPopInfo.activePop = this.recentSearchKeywords;
      }
    });
  }

  addSearchValueSubmitEventListener() {
    this.$searchWrap.querySelector('form').addEventListener('submit', () => {
      if (!this.searchValue) return;
      this.recentSearchKeywords.observe(this.searchValue);
    });
  }

  addSearchValueInputEventListener() {
    this.$searchInput.addEventListener('input', async event => {
      const key = event.key || event.keyCode;
      if (['ArrowDown', 'ArrowUp'].includes(key)) return;

      this.searchValue = this.$searchInput.value;
      if (this.searchValue) {
        this.recentSearchKeywords.hide();
        this.automaticCompletion.observe(this.searchValue);
        this.automaticCompletion.show();
        this.searchPopInfo.activePop = this.automaticCompletion;
        this.searchPopInfo.currentIndex = -1;
      } else {
        this.automaticCompletion.hide();
        this.recentSearchKeywords.show();
        this.searchPopInfo.activePop = this.recentSearchKeywords;
      }
    });
  }

  isPointerOnSearchPop() {
    return this.searchPopInfo.currentIndex >= 0 ? true : false;
  }

  isPointerOnSearchPopEnd() {
    const searchPopWordList = this.searchPopInfo.activePop.getWordList();
    return this.searchPopInfo.currentIndex > searchPopWordList.length - 1 ? true : false;
  }

  updateSearchValue() {
    const activedWord = this.searchPopInfo.activePop.getActiveWord(this.searchPopInfo.currentIndex);
    this.$searchInput.value = activedWord;
  }

  inactivateWordInSearchPop() {
    if (this.isPointerOnSearchPop()) this.searchPopInfo.activePop.inactiveWord(this.searchPopInfo.currentIndex);
  }

  moveActivePointerToUp() {
    this.searchPopInfo.currentIndex--;
    if (this.isPointerOnSearchPop()) {
      this.updateSearchValue();
      this.searchPopInfo.activePop.activeWord(this.searchPopInfo.currentIndex);
    } else this.$searchInput.value = this.searchValue;
  }

  moveActivePointerToDown() {
    this.searchPopInfo.currentIndex++;
    if (this.isPointerOnSearchPopEnd()) this.searchPopInfo.currentIndex = 0;
    this.updateSearchValue();
    this.searchPopInfo.activePop.activeWord(this.searchPopInfo.currentIndex);
  }

  activeSearchPopWord(key) {
    if (!this.searchPopInfo.activePop) this.inactivateWordInSearchPop();
    this.searchPopInfo.activePop.inactiveWord();
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
      if (event.isComposing || !['ArrowDown', 'ArrowUp'].includes(key) || !this.searchPopInfo.activePop) return;

      event.preventDefault();
      this.activeSearchPopWord(key);
    });
  }

  addSearchBarBlurEventListner() {
    this.$searchInput.addEventListener('blur', () => {
      this.recentSearchKeywords.hide();
      this.automaticCompletion.hide();
      this.searchPopInfo.activePop = null;
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

import { fetchData } from '../../../../utils/util.js';

export class AutomaticCompletion {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$automaticCompletionWrap = this.$searchWrap.querySelector('.search-automatic-completion-wrap');
    this.$automaticCompletion = this.$automaticCompletionWrap.querySelector('.search-automatic-completion');
  }

  connect(searchBar) {
    this.searchBar = searchBar;
  }

  async getAutomaticCompletionData() {
    const searchData = await fetchData('search');
    this.searchData = searchData;
  }

  hasSearchValue(searchValue, currentSearchData) {
    return searchValue && currentSearchData ? true : false;
  }

  render(searchValue) {
    this.$automaticCompletion.innerHTML = '';
    const currentSearchData = this.searchData[searchValue];
    if (!this.hasSearchValue(searchValue, currentSearchData)) {
      this.$automaticCompletionWrap.classList.remove('active');
      return;
    }
    this.$automaticCompletionWrap.classList.add('active');
    const automaticCompletionWordTemplate = currentSearchData
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

  show() {
    this.$automaticCompletionWrap.classList.add('active');
  }

  hide() {
    this.$automaticCompletionWrap.classList.remove('active');
  }

  highlightSearchValue(searchValue, currentSearchKeyword) {
    return currentSearchKeyword.replace(searchValue, `<b>${searchValue}</b>`);
  }

  init(searchBar) {
    this.connect(searchBar);
    this.getAutomaticCompletionData();
  }
}

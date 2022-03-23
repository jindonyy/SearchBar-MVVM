export class SearchCategoriesButton {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$categoriesButton = this.$searchWrap.querySelector('.search-categories-button');
  }

  conntect(searchCategories) {
    this.searchCategories = searchCategories;
  }

  render(selectedCategory = '전체') {
    this.$categoriesButton.textContent = selectedCategory;
  }

  addButtonClickEvent() {
    this.$categoriesButton.addEventListener('click', () => {
      this.searchCategories.toggle();
    });
  }

  addButtonBlurEvent() {
    this.$categoriesButton.addEventListener('blur', () => {
      this.searchCategories.hide();
    });
  }

  addEventListener() {
    this.addButtonClickEvent();
    this.addButtonBlurEvent();
  }

  init(searchCategories) {
    this.conntect(searchCategories);
    this.addEventListener();
  }
}

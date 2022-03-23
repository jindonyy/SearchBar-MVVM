export class SearchCategories {
  constructor() {
    this.$searchWrap = document.querySelector('.header__search-wrap');
    this.$categories = this.$searchWrap.querySelector('.search-categories');
  }

  connect(categoriesButton) {
    this.categoriesButton = categoriesButton;
  }

  render() {
    const categories = ['전체', '여성패션', '남성패션', '뷰티', '식품', '주방용품', '생활용품'];
    const categoriesTemplate = categories
      .map(
        category => `<li data-category="${category}">
                        <span>${category}</span>
                      </li>`
      )
      .join('');
    this.$categories.insertAdjacentHTML('afterbegin', categoriesTemplate);
  }

  hide() {
    this.$categories.classList.remove('active');
  }

  toggle() {
    this.$categories.classList.toggle('active');
  }

  addSearchCategoriesEvent() {
    this.$categories.addEventListener('mousedown', ({ target }) => {
      const selectedCategory = target.dataset.category;
      this.categoriesButton.render(selectedCategory);
      this.toggle();
    });
  }

  addEventListener() {
    this.addSearchCategoriesEvent();
  }

  init(categoriesButton) {
    this.connect(categoriesButton);
    this.render();
    this.addEventListener();
  }
}

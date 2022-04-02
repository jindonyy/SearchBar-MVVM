import { SearchCategoriesButton } from './search/SearchCategoriesButton.js';
import { SearchCategories } from './search/SearchCategories.js';
import { SearchBar } from './search/SearchBar.js';
import { RecentSearchKeywords } from './search/RecentSearchKeywords.js';
import { AutomaticCompletion } from './search/AutomaticCompletion.js';

export const Header = function () {
  this.searchCategories = new SearchCategories();
  this.searchCategoriesButton = new SearchCategoriesButton();
  this.searchBar = new SearchBar();
  this.recentSearchKeywords = new RecentSearchKeywords();
  this.automaticCompletion = new AutomaticCompletion();
};

Header.prototype.init = function () {
  this.searchCategories.init(this.searchCategoriesButton);
  this.searchCategoriesButton.init(this.searchCategories);
  this.searchBar.init(this.recentSearchKeywords, this.automaticCompletion);
};

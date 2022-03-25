import { localstorage } from '../../../stores/localstorage.js';
import { SearchCategoriesButton } from './search/SearchCategoriesButton.js';
import { SearchCategories } from './search/SearchCategories.js';
import { SearchBar } from './search/SearchBar.js';
import { RecentSearchKeywords } from './search/RecentSearchKeywords.js';
import { AutomaticCompletion } from './search/AutomaticCompletion.js';

export const Header = function () {
  this.RECENT_KEYWORDS_STORAGE_KEY = 'recentSearchKeywords';
  this.searchStorage = new localstorage(this.RECENT_KEYWORDS_STORAGE_KEY);
  this.searchCategories = new SearchCategories();
  this.searchCategoriesButton = new SearchCategoriesButton();
  this.recentSearchKeywords = new RecentSearchKeywords(this.searchStorage);
  this.automaticCompletion = new AutomaticCompletion();
  this.searchBar = new SearchBar();
  this.initSearchArea();
};

Header.prototype.initSearchArea = function () {
  this.searchCategories.init(this.searchCategoriesButton);
  this.searchCategoriesButton.init(this.searchCategories);
  this.recentSearchKeywords.init(this.searchBar);
  this.automaticCompletion.init(this.searchBar);
  this.searchBar.init(this.recentSearchKeywords, this.automaticCompletion);
};

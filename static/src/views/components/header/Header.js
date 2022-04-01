import { SearchCategoriesButton } from './search/SearchCategoriesButton.js';
import { SearchCategories } from './search/SearchCategories.js';
import { SearchBar } from './search/SearchBar.js';
import { RecentSearchKeywords } from './search/RecentSearchKeywords.js';
import { AutomaticCompletion } from './search/AutomaticCompletion.js';

export const Header = function () {
  this.searchCategories = new SearchCategories();
  this.searchCategoriesButton = new SearchCategoriesButton();
  new SearchBar(new RecentSearchKeywords(), new AutomaticCompletion());
};

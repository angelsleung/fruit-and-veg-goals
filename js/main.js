function clickNext(event) {
  event.preventDefault();
  navSearch();
}

function searchInput(event) {
  var input = $searchBar.value;
  return input;
}

function navHome(event) {
  $goalForm.className = 'goal form';
  $searchForm.className = 'search form hidden';
}

function navSearch(event) {
  $searchForm.className = 'search form';
  $goalForm.className = 'goal form hidden';
}

var $goalForm = document.querySelector('.goal.form');
var $searchForm = document.querySelector('.search.form');

var $next = document.querySelector('.next');
$next.addEventListener('click', clickNext);

var $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

var $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

var $searchBar = document.querySelector('.search-bar');
$searchBar.addEventListener('input', searchInput);

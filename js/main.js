function clickNext(event) {
  event.preventDefault();
  navSearch();
}

function searchInput(event) {
  var input = $searchBar.value;
  if (input.length < 2) {
    for (var i = 0; i < 4; i++) {
      $results[i].className = 'result hidden';
    }
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + input);
  xhr.responseType = 'json';
  xhr.setRequestHeader('x-app-id', 'bfc55df9');
  xhr.setRequestHeader('x-app-key', '1f25dd0b4d78d51f94978f4a597c4a21');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', function () {
    data.results = xhr.response.common;
    for (var i = 0; i < 4; i++) {
      $results[i].className = 'result';
      $imgResults[i].setAttribute('src', data.results[i].photo.thumb);
      $textResults[i].textContent = data.results[i].food_name;
    }
  });
  xhr.send();
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

var $results = document.querySelectorAll('.result');
var $imgResults = document.querySelectorAll('.img-result');
var $textResults = document.querySelectorAll('.text-result');

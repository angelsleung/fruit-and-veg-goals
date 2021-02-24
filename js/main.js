function setGoal(event) {
  event.preventDefault();
  navSearch();
}

function searchInput(event) {
  var input = $searchBar.value;
  if (input.length < 2) {
    data.results = [];
    for (var i = 0; i < 4; i++) {
      $results[i].className = 'result hidden';
    }
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?branded=false&query=' + input);
  xhr.responseType = 'json';
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
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

function delayAutofill() {
  setTimeout(searchInput, 1000);
}

function searchItem(event) {
  event.preventDefault();
}

function clickResult(event) {
  searchItem();
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
$goalForm.addEventListener('submit', setGoal);

var $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

var $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

var $searchBar = document.querySelector('.search-bar');
$searchBar.addEventListener('input', delayAutofill);

var $results = document.querySelectorAll('.result');
var $imgResults = document.querySelectorAll('.img-result');
var $textResults = document.querySelectorAll('.text-result');

var $searchForm = document.querySelector('.search.form');
$searchForm.addEventListener('submit', searchItem);

var $searchResults = document.querySelector('.results');
$searchResults.addEventListener('click', clickResult);

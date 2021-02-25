var $goalForm = document.querySelector('.goal.form');
$goalForm.addEventListener('submit', setGoal);

var $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

var $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

var $searchBar = document.querySelector('.search-bar');
$searchBar.addEventListener('input', delaySuggestions);

var $results = document.querySelectorAll('.result');
var $imgResults = document.querySelectorAll('.img-result');
var $textResults = document.querySelectorAll('.text-result');

var $searchForm = document.querySelector('.search.form');
$searchForm.addEventListener('submit', submitSearch);

var $searchBarSuggestions = document.querySelector('.search-bar-suggestions');
$searchBarSuggestions.addEventListener('click', clickSuggestion);

var $resultsPage = document.querySelector('.results-page');
var $resultsPageTitle = document.querySelector('.search-results');

var $resultList = document.querySelector('.result-list');
$resultList.addEventListener('click', clickResultList);

var $itemDetailsPage = document.querySelector('.item-details-page');

var $servingSize = document.querySelector('.serving-size');
var $calories = document.querySelector('.calories');
// var $caloriesFat = document.querySelector('.');
// var $totalFat = document.querySelector('.');
// var $sodium = document.querySelector('.');
// var $potassium = document.querySelector('.');
// var totalCarbs = document.querySelector('.');
// var $fiber = document.querySelector('.');
// var $sugar = document.querySelector('.');
// var $protein = document.querySelector('.');
// var $totalFatPercent = document.querySelector('.');
// var $sodiumPercent = document.querySelector('.');
// var $potassiumPercent = document.querySelector('.');
// var $totalCarbsPercent = document.querySelector('.');
// var $fiberPercent = document.querySelector('.');
// var $sugarPercent = document.querySelector('.');
// var $proteinPercent = document.querySelector('.');

var delaySuggestionsID = null;

function setGoal(event) {
  event.preventDefault();
  navSearch();
}

function searchInput(event) {
  var input = $searchBar.value;
  if (input.length < 2) {
    input = '';
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
    if (data.view === 'search-input') {
      for (i = 0; i < 4; i++) {
        $results[i].className = 'result';
        $textResults[i].textContent = data.results[i].food_name;
        $imgResults[i].setAttribute('src', data.results[i].photo.thumb);
        $imgResults[i].setAttribute('alt', data.results[i].food_name + ' image');
      }
    } else {
      $resultsPageTitle.textContent = 'Search results for "' + input + '"';
      for (i = 0; i < data.results.length; i++) {
        var resultDiv = renderResult(data.results[i]);
        $resultList.append(resultDiv);
      }
    }
  });
  xhr.send();
}

function getNutritionFacts() {
  var body = {
    query: 'kale'
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', function () {
    data.nutrition = xhr.response.foods;
    // console.log(data.results);
  });
  xhr.send(JSON.stringify(body));
  $servingSize.textContent = data.nutrition.serving_qty + ' ' + data.nutrition.serving_unit + ' (' + data.nutrition.serving_weight_grams + 'g)';
  $calories.textContent = data.nutrition.nf_calories;
  return data.nutrition;
}

function delaySuggestions() {
  clearTimeout(delaySuggestionsID);
  delaySuggestionsID = setTimeout(searchInput, 500);
}

function clickSuggestion(event) {
  if (event.target.className === 'search-bar') {
    return;
  }
  getNutritionFacts();
}

function submitSearch(event) {
  event.preventDefault();
  data.view = 'search-results';
  clearTimeout(delaySuggestionsID);
  while ($resultList.firstChild) {
    $resultList.removeChild($resultList.firstChild);
  }
  searchInput();
  $searchForm.reset();
  for (var i = 0; i < 4; i++) {
    $results[i].className = 'result hidden';
  }
  $resultsPage.className = 'results-page';
  $searchForm.className = 'search form hidden';
}

function navHome(event) {
  data.view = 'home';
  $goalForm.className = 'goal form';
  $searchForm.className = 'search form hidden';
  $resultsPage.className = 'results-page hidden';
  $itemDetailsPage.className = 'item-details-page hidden';

}

function navSearch(event) {
  data.view = 'search-input';
  $searchForm.className = 'search form';
  $goalForm.className = 'goal form hidden';
  $resultsPage.className = 'results-page hidden';
  $itemDetailsPage.className = 'item-details-page hidden';
  $searchBar.focus();
}

function renderResult(foodItem) {
  var result = document.createElement('div');
  result.className = 'result-div row';

  var imgDiv = document.createElement('div');
  imgDiv.className = 'img-div';
  result.append(imgDiv);

  var imgResult = document.createElement('img');
  imgResult.className = 'img-result';
  imgResult.setAttribute('src', foodItem.photo.thumb);
  imgResult.setAttribute('alt', foodItem.food_name + ' image');
  imgDiv.append(imgResult);

  var resultText = document.createElement('div');
  resultText.className = 'result-text';
  result.append(resultText);

  var resultName = document.createElement('div');
  resultName.className = 'result-name';
  resultName.textContent = foodItem.food_name;
  resultText.append(resultName);

  var resultDescription = document.createElement('div');
  resultDescription.className = 'result-description';
  resultDescription.textContent = foodItem.serving_qty + ' ' + foodItem.serving_unit;
  resultText.append(resultDescription);

  var columnFourth = document.createElement('div');
  columnFourth.className = 'column-one-fourth';
  result.append(columnFourth);

  var fruitIconDiv = document.createElement('div');
  fruitIconDiv.className = 'icon-div fruit';
  columnFourth.append(fruitIconDiv);

  var fruitItemIcon = document.createElement('i');
  fruitItemIcon.className = 'item-icon fas fa-apple-alt';
  fruitItemIcon.setAttribute('data-food-name', foodItem.food_name);
  fruitIconDiv.append(fruitItemIcon);

  var vegIconDiv = document.createElement('div');
  vegIconDiv.className = 'icon-div veg';
  columnFourth.append(vegIconDiv);

  var vegItemIcon = document.createElement('i');
  vegItemIcon.className = 'item-icon fas fa-carrot';
  vegItemIcon.setAttribute('data-food-name', foodItem.food_name);
  vegIconDiv.append(vegItemIcon);

  return result;
}

function clickResultList(event) {
  if (!event.target.matches('.item-icon')) {
    return;
  }
  var foodName = event.target.dataset.foodName;
  event.target.style.color = 'lightgreen';
  if (event.target.matches('.fa-apple-alt')) {
    data.fruits.push(foodName);
  } else {
    data.veggies.push(foodName);
  }
}

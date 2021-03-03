var $goalForm = document.querySelector('.goal.form');
$goalForm.addEventListener('submit', setGoal);

var $navHome = document.querySelector('.fa-home');
$navHome.addEventListener('click', navHome);

var $navSearch = document.querySelector('.fa-search');
$navSearch.addEventListener('click', navSearch);

var $navLog = document.querySelector('.fa-list');
$navLog.addEventListener('click', loadDailyLog);

var $navProgress = document.querySelector('.fa-chart-bar');
$navProgress.addEventListener('click', navProgress);

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

var $addFruitButton = document.querySelector('.add-fruit');
$addFruitButton.addEventListener('click', clickAddFruit);

var $addVegButton = document.querySelector('.add-veg');
$addVegButton.addEventListener('click', clickAddVeg);

var $dailyLogPage = document.querySelector('.daily-log-page');
var $fruitLog = document.querySelector('.fruit-log');
var $vegLog = document.querySelector('.veg-log');

var $noFruit = document.querySelector('.no-fruit');
var $noVeg = document.querySelector('.no-veg');

var $progressPage = document.querySelector('.progress-page');

var $itemDetailsPage = document.querySelector('.item-details-page');
var $itemDetailsImg = document.querySelector('.item-details-img');
var $itemDetailsName = document.querySelector('.item-details-name');
var $nutritionFoodName = document.querySelector('.nutrition-food-name');
var $servingSize = document.querySelector('.serving-size');
var $calories = document.querySelector('.calories');
var $caloriesFat = document.querySelector('.calories-fat');
var $totalFat = document.querySelector('.total-fat');
var $sodium = document.querySelector('.sodium');
var $potassium = document.querySelector('.potassium');
var totalCarbs = document.querySelector('.total-carbs');
var $fiber = document.querySelector('.fiber');
var $sugar = document.querySelector('.sugar');
var $protein = document.querySelector('.protein');
var $totalFatPercent = document.querySelector('.total-fat-percent');
var $sodiumPercent = document.querySelector('.sodium-percent');
var $potassiumPercent = document.querySelector('.potassium-percent');
var $totalCarbsPercent = document.querySelector('.total-carbs-percent');
var $fiberPercent = document.querySelector('.fiber-percent');

var $fruitProgress = document.querySelector('.fruit-progress');
var $fruitBar = document.querySelector('.fruit-bar');
var $vegProgress = document.querySelector('.veg-progress');
var $vegBar = document.querySelector('.veg-bar');

var delaySuggestionsID = null;

function setGoal(event) {
  event.preventDefault();
  data.fruitGoal = $goalForm.elements.fruit.value;
  data.veggieGoal = $goalForm.elements.veg.value;
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
    if (data.view === 'search input') {
      for (i = 0; i < 4; i++) {
        $results[i].className = 'result';
        $results[i].setAttribute('data-food-name', data.results[i].food_name);
        $textResults[i].textContent = data.results[i].food_name;
        $imgResults[i].setAttribute('src', data.results[i].photo.thumb);
        $imgResults[i].setAttribute('alt', data.results[i].food_name);
      }
    } else {
      $resultsPageTitle.textContent = 'Search results for "' + input + '"';
      for (i = 0; i < data.results.length; i++) {
        var resultDiv = renderResult(data.results[i]);
        $resultList.append(resultDiv);
      }
      $resultsPage.className = 'results-page';
      $searchForm.className = 'search form hidden';
    }
  });
  xhr.send();
}

function getNutritionFacts(foodName) {
  hideAllViews();
  data.view = 'item details';
  $itemDetailsImg.setAttribute('alt', foodName);
  $itemDetailsName.textContent = foodName;
  $nutritionFoodName.textContent = foodName;
  // if (data.fruits.includes(foodName)) {
  //   $addFruitButton.className = 'added add-fruit add-button';
  // } else {
  //   $addFruitButton.className = 'not-added add-fruit add-button';
  // }
  // if (data.veggies.includes(foodName)) {
  //   $addVegButton.className = 'added add-veg add-button';
  // } else {
  //   $addVegButton.className = 'not-added add-veg add-button';
  // }
  var body = {
    query: foodName
  };
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://trackapi.nutritionix.com/v2/natural/nutrients');
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('x-app-id', 'c1479c3a');
  xhr.setRequestHeader('x-app-key', '2f7f3b0e2a3ffe42df018fc46a4cc852');
  xhr.setRequestHeader('x-remote-user-id', 0);
  xhr.addEventListener('load', function () {
    data.nutrition = xhr.response.foods[0];
    $itemDetailsImg.setAttribute('src', data.nutrition.photo.thumb);
    data.nutrition.servingSize = data.nutrition.serving_qty + ' ' + data.nutrition.serving_unit + ' (' + data.nutrition.serving_weight_grams + 'g)';
    $servingSize.textContent = data.nutrition.servingSize;
    $calories.textContent = Math.floor(data.nutrition.nf_calories);
    $caloriesFat.textContent = Math.floor(data.nutrition.nf_total_fat * 90) / 10;
    $totalFat.textContent = Math.floor(data.nutrition.nf_total_fat * 10) / 10 + 'g';
    $sodium.textContent = Math.floor(data.nutrition.nf_sodium) + 'mg';
    $potassium.textContent = Math.floor(data.nutrition.nf_potassium) + 'mg';
    totalCarbs.textContent = Math.floor(data.nutrition.nf_total_carbohydrate * 10) / 10 + 'g';
    $fiber.textContent = Math.floor(data.nutrition.nf_dietary_fiber * 10) / 10 + 'g';
    $sugar.textContent = Math.floor(data.nutrition.nf_sugars * 10) / 10 + 'g';
    $protein.textContent = Math.floor(data.nutrition.nf_protein * 10) / 10 + 'g';
    $totalFatPercent.textContent = Math.floor(data.nutrition.nf_total_fat * 100 / 78) + '%';
    $sodiumPercent.textContent = Math.floor(data.nutrition.nf_sodium * 100 / 2300) + '%';
    $potassiumPercent.textContent = Math.floor(data.nutrition.nf_potassium * 100 / 4700) + '%';
    $totalCarbsPercent.textContent = Math.floor(data.nutrition.nf_total_carbohydrate * 100 / 275) + '%';
    $fiberPercent.textContent = Math.floor(data.nutrition.nf_dietary_fiber * 100 / 28) + '%';
    $itemDetailsPage.className = 'item-details-page';
  });
  xhr.send(JSON.stringify(body));
}

function delaySuggestions() {
  clearTimeout(delaySuggestionsID);
  delaySuggestionsID = setTimeout(searchInput, 500);
}

function clickSuggestion(event) {
  if (event.target.className === 'search-bar') {
    return;
  }
  var foodResult = event.target.closest('.result');
  var foodName = foodResult.dataset.foodName;
  getNutritionFacts(foodName);
}

function submitSearch(event) {
  event.preventDefault();
  data.view = 'search results';
  clearTimeout(delaySuggestionsID);
  while ($resultList.firstChild) {
    $resultList.removeChild($resultList.firstChild);
  }
  searchInput();
}

function navHome(event) {
  data.view = 'home';
  hideAllViews();
  $goalForm.className = 'goal form';
}

function navSearch(event) {
  data.view = 'search input';
  for (var i = 0; i < 4; i++) {
    $results[i].className = 'result hidden';
  }
  hideAllViews();
  $searchForm.className = 'search form';
  $searchForm.reset();
  $searchBar.focus();
}

function navProgress(event) {
  var fruitPercent = 100 * data.fruits.length / data.fruitGoal;
  var vegPercent = 100 * data.veggies.length / data.veggieGoal;
  var reachedFruitGoal = fruitPercent >= 100;
  var reachedVegGoal = vegPercent >= 100;
  $fruitProgress.textContent = data.fruits.length + '/' + data.fruitGoal + ' completed (' + Math.floor(fruitPercent) + '%)';
  $vegProgress.textContent = data.veggies.length + '/' + data.veggieGoal + ' completed (' + Math.floor(vegPercent) + '%)';
  if (reachedFruitGoal) {
    $fruitBar.style.width = '100%';
    $fruitBar.backgroundColor = 'lightsalmon';
    $fruitBar.textContent = 'You did it!';
  } else {
    $fruitBar.style.width = fruitPercent + '%';
  }
  if (reachedVegGoal) {
    $vegBar.style.width = '100%';
    $vegBar.backgroundColor = 'lightsalmon';
    $vegBar.textContent = 'You did it!';
  } else {
    $vegBar.style.width = vegPercent + '%';
  }
  hideAllViews();
  $progressPage.className = 'progress-page';
  data.view = 'progress page';
}

function renderResult(foodItem) {
  var result = document.createElement('div');
  result.className = 'result-div row';
  result.setAttribute('data-name', foodItem.food_name);
  var servingSize = foodItem.serving_qty + ' ' + foodItem.serving_unit;
  result.setAttribute('data-serving-size', servingSize);
  result.setAttribute('data-image', foodItem.photo.thumb);

  var imgDiv = document.createElement('div');
  imgDiv.className = 'img-div';
  result.append(imgDiv);

  var imgResult = document.createElement('img');
  imgResult.className = 'img-result';
  imgResult.setAttribute('src', foodItem.photo.thumb);
  imgResult.setAttribute('alt', foodItem.food_name);
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
  resultDescription.textContent = servingSize;
  resultText.append(resultDescription);

  var columnFourth = document.createElement('div');
  columnFourth.className = 'column-one-fourth';
  result.append(columnFourth);

  var fruitIconDiv = document.createElement('div');
  fruitIconDiv.className = 'icon-div fruit';
  columnFourth.append(fruitIconDiv);

  var fruitItemIcon = document.createElement('i');
  fruitItemIcon.className = 'item-icon not-added-icon fas fa-apple-alt';
  fruitIconDiv.append(fruitItemIcon);

  var vegIconDiv = document.createElement('div');
  vegIconDiv.className = 'icon-div veg';
  columnFourth.append(vegIconDiv);

  var vegItemIcon = document.createElement('i');
  vegItemIcon.className = 'item-icon not-added-icon fas fa-carrot';
  vegIconDiv.append(vegItemIcon);

  return result;
}

function addItem(foodType, name, servingSize, image) {
  var foodObject = {
    name: name,
    servingSize: servingSize,
    image: image
  };
  data[foodType].push(foodObject);
}

function removeItem(foodType, name) {
  for (var i = 0; i < data[foodType].length; i++) {
    if (data[foodType][i].name === name) {
      data[foodType].splice(i, 1);
      return;
    }
  }
}

function clickResultList(event) {
  var resultElement = event.target.closest('.result-div');
  if (event.target.matches('.item-icon')) {
    if (event.target.matches('.not-added-icon')) {
      if (event.target.matches('.fa-apple-alt')) {
        event.target.className = 'item-icon added-icon fas fa-apple-alt';
        addItem('fruits', resultElement.dataset.name, resultElement.dataset.servingSize, resultElement.dataset.image);
      } else {
        event.target.className = 'item-icon added-icon fas fa-carrot';
        addItem('veggies', resultElement.dataset.name, resultElement.dataset.servingSize, resultElement.dataset.image);
      }
    } else {
      if (event.target.matches('.fa-apple-alt')) {
        event.target.className = 'item-icon not-added-icon fas fa-apple-alt';
        removeItem('fruits', resultElement.dataset.name);
      } else {
        event.target.className = 'item-icon not-added-icon fas fa-carrot';
        removeItem('veggies', resultElement.dataset.name);
      }
    }
  } else {
    getNutritionFacts(resultElement.dataset.name);
  }
}

function clickAddFruit(event) {
  if ($addFruitButton.matches('.not-added')) {
    $addFruitButton.className = 'add-fruit add-button added';
    addItem('fruits', data.nutrition.food_name, data.nutrition.servingSize, data.nutrition.photo.thumb);
  } else {
    $addFruitButton.className = 'add-fruit add-button not-added';
    removeItem('fruits', data.nutrition.food_name);
  }
}

function clickAddVeg(event) {
  if ($addVegButton.matches('.not-added')) {
    $addVegButton.className = 'add-veg add-button added';
    addItem('veggies', data.nutrition.food_name, data.nutrition.servingSize, data.nutrition.photo.thumb);
  } else {
    $addVegButton.className = 'add-veg add-button not-added';
    removeItem('veggies', data.nutrition.food_name);
  }
}

function renderLogEntry(entry) {
  var result = document.createElement('div');
  result.className = 'result-div row';

  var imgDiv = document.createElement('div');
  imgDiv.className = 'img-div';
  result.append(imgDiv);

  var imgResult = document.createElement('img');
  imgResult.className = 'img-result';
  imgResult.setAttribute('src', entry.image);
  imgResult.setAttribute('alt', entry.name);
  imgDiv.append(imgResult);

  var resultText = document.createElement('div');
  resultText.className = 'result-text';
  result.append(resultText);

  var resultName = document.createElement('div');
  resultName.className = 'result-name';
  resultName.textContent = entry.name;
  resultText.append(resultName);

  var resultDescription = document.createElement('div');
  resultDescription.className = 'result-description';
  resultDescription.textContent = entry.servingSize;
  resultText.append(resultDescription);

  return result;
}

function loadDailyLog(event) {
  hideAllViews();
  if (data.fruits.length === 0) {
    $noFruit.className = 'no-fruit';
  } else {
    $noFruit.className = 'no-fruit hidden';
  }
  if (data.veggies.length === 0) {
    $noVeg.className = 'no-veg';
  } else {
    $noVeg.className = 'no-veg hidden';
  }
  while ($fruitLog.firstChild) {
    $fruitLog.removeChild($fruitLog.firstChild);
  }
  while ($vegLog.firstChild) {
    $vegLog.removeChild($vegLog.firstChild);
  }
  for (var i = 0; i < data.fruits.length; i++) {
    var renderedEntry = renderLogEntry(data.fruits[i]);
    $fruitLog.append(renderedEntry);
  }
  for (i = 0; i < data.veggies.length; i++) {
    renderedEntry = renderLogEntry(data.veggies[i]);
    $vegLog.append(renderedEntry);
  }
  $dailyLogPage.className = 'daily-log-page';
  data.view = 'daily log';
}

function hideAllViews() {
  $goalForm.className = 'goal form hidden';
  $searchForm.className = 'search form hidden';
  $resultsPage.className = 'results-page hidden';
  $itemDetailsPage.className = 'item-details-page hidden';
  $dailyLogPage.className = 'daily-log-page hidden';
  $progressPage.className = 'progress-page hidden';
}

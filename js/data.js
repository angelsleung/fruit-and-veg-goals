/* exported data */
var data = {
  view: 'home',
  results: null,
  nutrition: null,
  fruitGoal: 4,
  veggieGoal: 5,
  fruits: [],
  veggies: [],
  newUser: true
};

var previousData = localStorage.getItem('local-data');
if (previousData !== null) {
  data = JSON.parse(previousData);
  data.newUser = false;
}
window.addEventListener('beforeunload', beforeUnload);

function beforeUnload(event) {
  var localData = JSON.stringify(data);
  localStorage.setItem('local-data', localData);
}

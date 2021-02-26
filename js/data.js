/* exported data */
var data = {
  view: 'home',
  results: null,
  nutrition: null,
  selected: null,
  fruits: [],
  veggies: []
};

var previousData = localStorage.getItem('local-data');
if (previousData !== null) {
  data = JSON.parse(previousData);
}
window.addEventListener('beforeunload', beforeUnload);

function beforeUnload(event) {
  var localData = JSON.stringify(data);
  localStorage.setItem('local-data', localData);
}

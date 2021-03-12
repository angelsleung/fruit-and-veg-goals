/* exported data */
let data = {
  view: 'home',
  results: null,
  nutrition: null,
  fruitGoal: 4,
  veggieGoal: 5,
  fruits: [],
  veggies: [],
  newUser: true,
  logUpdated: true,
  progressUpdated: true
};

const previousData = localStorage.getItem('local-data');
if (previousData !== null) {
  data = JSON.parse(previousData);
  data.newUser = false;
}
window.addEventListener('beforeunload', beforeUnload);

function beforeUnload(event) {
  const localData = JSON.stringify(data);
  localStorage.setItem('local-data', localData);
}

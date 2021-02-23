function clickNext(event) {
  event.preventDefault();
}
var $form = document.querySelector('.form');
$form.addEventListener('submit', clickNext);

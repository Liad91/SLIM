angular
  .module('slim')
  .filter('availability', availability);

function availability() {
  return (items, available) => items.filter(item => Boolean(item.available) === available);
}
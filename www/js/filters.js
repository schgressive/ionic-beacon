angular.module('beaconDemo.filters', [])

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

.filter('truncate', function () {
  return function (input, length, text) {
    var result;
    if (input && input.toString().length > length) {
      result = input.toString().substring(0, length).slice(0, (text.length) * -1) + text.toString();
    } else {
      result = input;
    }
    return result;
  };
})

.filter('capitalize', function() {
  return function(input, scope) {
    if (input !== null && input !== undefined){
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

  }
})
;
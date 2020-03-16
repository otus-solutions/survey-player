(function () {
'use strict';

angular.module('otusjs.player.standalone')
  .run(Runner);

Runner.$inject = [
  '$window',
  '$rootScope'
];

function Runner($window, $rootScope) {
  $rootScope.online = navigator.onLine;
  $window.addEventListener("offline", function () {
    $rootScope.$apply(function() {
      $rootScope.online = false;
    });
  }, false);
  $window.addEventListener("online", function () {
    $rootScope.$apply(function() {
      $rootScope.online = true;
    });
  }, false);

}
})();
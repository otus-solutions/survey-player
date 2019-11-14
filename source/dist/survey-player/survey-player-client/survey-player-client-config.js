(function () {
  'use strict';

  angular.module('survey.player.client').config(['$httpProvider', Interceptor]);

  function Interceptor($httpProvider) {
    $httpProvider.interceptors.push('Interceptor');
  }
})();
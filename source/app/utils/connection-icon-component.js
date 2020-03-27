(function () {
  'use strict';

  angular.module('otusjs.player.standalone')
    .component('connectionIcon', {
      template: `<md-icon ng-if="$ctrl.online">wifi</md-icon>
        <md-icon ng-if="!$ctrl.online">wifi_off</md-icon>
        <md-tooltip ng-if="$ctrl.online">Online</md-tooltip>
        <md-tooltip ng-if="!$ctrl.online">Offline</md-tooltip>`,
      controller: Controller
    });

  Controller.$inject = [
    '$window',
    '$rootScope'
  ];

  function Controller($window, $rootScope) {
    var self = this;
    $rootScope.online = navigator.onLine;
    self.online = $rootScope.online;
    $window.addEventListener("offline", function () {
      $rootScope.$apply(function () {
        $rootScope.online = false;
        self.online = false;
      });
    }, false);
    $window.addEventListener("online", function () {
      $rootScope.$apply(function () {
        $rootScope.online = true;
        self.online = true;
      });
    }, false);

  }
})();